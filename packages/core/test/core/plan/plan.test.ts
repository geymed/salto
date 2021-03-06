/*
*                      Copyright 2020 Salto Labs Ltd.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
import _ from 'lodash'
import wu from 'wu'
import { ElemID, ObjectType, Field, BuiltinTypes, InstanceElement, getChangeElement, PrimitiveType, PrimitiveTypes, Element, DependencyChanger, dependencyChange, ListType, isInstanceElement, ChangeGroupIdFunction, isField } from '@salto-io/adapter-api'
import * as mock from '../../common/elements'
import { getFirstPlanItem, getChange } from '../../common/plan'
import { mockFunction } from '../../common/helpers'
import { getPlan, Plan, PlanItem } from '../../../src/core/plan'

type PlanGenerators = {
  planWithTypeChanges: () => Promise<[Plan, ObjectType]>
  planWithFieldChanges: () => Promise<[Plan, ObjectType]>
  planWithNewType: () => Promise<[Plan, PrimitiveType]>
  planWithInstanceChange: () => Promise<[Plan, InstanceElement]>
  planWithListChange: () => Promise<[Plan, InstanceElement]>
  planWithAnnotationTypesChanges: () => Promise<[Plan, ObjectType]>
  planWithFieldIsListChanges: () => Promise<[Plan, ObjectType]>
  planWithSplitElem: (isAdd: boolean) => Promise<[Plan, ObjectType]>
  planWithDependencyCycle: (withValidator: boolean) => Promise<Plan>
}

export const planGenerators = (allElements: ReadonlyArray<Element>): PlanGenerators => ({
  planWithTypeChanges: async () => {
    const afterElements = mock.getAllElements()
    const saltoOffice = afterElements[2]
    saltoOffice.annotations.label = 'new label'
    saltoOffice.annotations.new = 'new annotation'
    const plan = await getPlan({ before: allElements, after: afterElements })
    return [plan, saltoOffice]
  },

  planWithFieldChanges: async () => {
    const afterElements = mock.getAllElements()
    const saltoOffice = afterElements[2]
    // Adding new field
    saltoOffice.fields.new = new Field(saltoOffice, 'new', BuiltinTypes.STRING)
    // Sub element change
    saltoOffice.fields.location.annotations.label = 'new label'
    const plan = await getPlan({ before: allElements, after: afterElements })
    return [plan, saltoOffice]
  },

  planWithNewType: async () => {
    const newElement = new PrimitiveType({
      elemID: new ElemID('salto', 'additional'),
      primitive: PrimitiveTypes.STRING,
    })
    const plan = await getPlan({ before: allElements, after: [...allElements, newElement] })
    return [plan, newElement]
  },

  planWithInstanceChange: async () => {
    const afterElements = mock.getAllElements()
    const updatedEmployee = afterElements[4]
    updatedEmployee.value.nicknames[1] = 'new'
    delete updatedEmployee.value.office.name
    const plan = await getPlan({ before: allElements, after: afterElements })
    return [plan, updatedEmployee]
  },

  planWithListChange: async () => {
    const afterElements = mock.getAllElements()
    const updatedEmployee = afterElements[4]
    updatedEmployee.value.nicknames.push('new')
    const plan = await getPlan({ before: allElements, after: afterElements })
    return [plan, updatedEmployee]
  },

  planWithAnnotationTypesChanges: async () => {
    const afterElements = mock.getAllElements()
    const saltoOffice = afterElements[2]
    const saltoAddress = afterElements[1]
    // update annotation types
    saltoOffice.annotationTypes.new = BuiltinTypes.STRING
    saltoOffice.annotationTypes.address = saltoAddress.clone({ label: 'test label' })
    const plan = await getPlan({ before: allElements, after: afterElements })
    return [plan, saltoOffice]
  },

  planWithFieldIsListChanges: async () => {
    const afterElements = mock.getAllElements()
    const saltoOffice = afterElements[2]
    saltoOffice.fields.name.type = new ListType(saltoOffice.fields.name.type)
    saltoOffice.fields.rooms.type = BuiltinTypes.STRING
    const plan = await getPlan({ before: allElements, after: afterElements })
    return [plan, saltoOffice]
  },

  planWithSplitElem: async isAdd => {
    const afterElements = mock.getAllElements()
    const [,, saltoOffice, saltoEmployee] = afterElements
    saltoOffice.fields.test = new Field(saltoOffice, 'test', BuiltinTypes.STRING)
    const depChanger: DependencyChanger = async changes => {
      const changeByElem = new Map(
        wu(changes).map(([id, change]) => [getChangeElement(change).elemID.getFullName(), id]),
      )
      const officeChange = changeByElem.get(saltoOffice.elemID.getFullName())
      const officeFieldChange = changeByElem.get(saltoOffice.fields.test.elemID.getFullName())
      const employeeChange = changeByElem.get(saltoEmployee.elemID.getFullName())
      if (officeChange && officeFieldChange && employeeChange) {
        return isAdd
          ? [
            dependencyChange('add', employeeChange, officeChange),
            dependencyChange('add', officeFieldChange, employeeChange),
          ]
          : [
            dependencyChange('add', officeChange, employeeChange),
            dependencyChange('add', employeeChange, officeFieldChange),
          ]
      }
      return []
    }
    const plan = isAdd
      ? await getPlan({ before: [], after: afterElements, dependencyChangers: [depChanger] })
      : await getPlan({ before: afterElements, after: [], dependencyChangers: [depChanger] })
    return [plan, saltoOffice]
  },

  planWithDependencyCycle: async withValidator => {
    const afterElements = mock.getAllElements()
    const [,, saltoOffice] = afterElements
    const depChanger: DependencyChanger = async changes => {
      const officeFieldChangeIds = wu(changes)
        .filter(([_id, change]) => {
          const elem = getChangeElement(change)
          return isField(elem) && elem.parent.elemID.isEqual(saltoOffice.elemID)
        })
        .map(([id]) => id)
        .slice(0, 2)
        .toArray()
      return [
        dependencyChange('add', officeFieldChangeIds[0], officeFieldChangeIds[1]),
        dependencyChange('add', officeFieldChangeIds[1], officeFieldChangeIds[0]),
      ]
    }
    return getPlan({
      before: [],
      after: afterElements,
      dependencyChangers: [depChanger],
      changeValidators: withValidator ? { salto: async () => [] } : {},
    })
  },
})

describe('getPlan', () => {
  const allElements = mock.getAllElements()

  const {
    planWithTypeChanges,
    planWithFieldChanges,
    planWithNewType,
    planWithSplitElem,
    planWithDependencyCycle,
  } = planGenerators(allElements)

  it('should create empty plan', async () => {
    const plan = await getPlan({ before: allElements, after: allElements })
    expect(plan.size).toBe(0)
  })

  it('should create plan with add change', async () => {
    const [plan, newElement] = await planWithNewType()
    expect(plan.size).toBe(1)
    const planItem = getFirstPlanItem(plan)
    expect(planItem.groupKey).toBe(newElement.elemID.getFullName())
    // We should only get the new type change, new fields are contained in it
    expect(planItem.items.size).toBe(1)
    const change = getChange(planItem, newElement.elemID)
    expect(change.action).toBe('add')
    expect(getChangeElement(change)).toEqual(newElement)
  })

  it('should create plan with remove change', async () => {
    const pre = allElements
    const preFiltered = pre.filter(element => element.elemID.name !== 'instance')
    const plan = await getPlan({ before: pre, after: preFiltered })
    expect(plan.size).toBe(1)
    const planItem = getFirstPlanItem(plan)
    const removed = _.find(pre, element => element.elemID.name === 'instance')
    expect(isInstanceElement(removed)).toBeTruthy()
    expect(planItem.groupKey).toBe((removed as InstanceElement).elemID.getFullName())
    const removedChange = getChange(planItem, (removed as InstanceElement).elemID)
    expect(removedChange.action).toBe('remove')
    if (removedChange.action === 'remove') {
      expect(removedChange.data.before).toEqual(removed)
    }
  })

  it('should create plan with modification changes due to field changes', async () => {
    const [plan, changedElem] = await planWithFieldChanges()
    expect(plan.size).toBe(1)
    const planItem = getFirstPlanItem(plan)
    expect(planItem.groupKey).toBe(changedElem.elemID.getFullName())
    expect(getChange(planItem, changedElem.elemID)).toBeUndefined()
    expect(getChange(planItem, changedElem.fields.new.elemID).action).toBe('add')
    expect(getChange(planItem, changedElem.fields.location.elemID).action).toBe('modify')
  })

  it('should create plan with modification changes due to value change', async () => {
    const post = mock.getAllElements()
    const employee = post[4]
    employee.value.name = 'SecondEmployee'
    const plan = await getPlan({ before: allElements, after: post })
    expect(plan.size).toBe(1)
    const planItem = getFirstPlanItem(plan)
    expect(planItem.groupKey).toBe(employee.elemID.getFullName())
    expect(getChange(planItem, employee.elemID).action).toBe('modify')
    expect(planItem.items.size).toBe(1)
  })
  it('should create plan with modification change in primary element (no inner changes)', async () => {
    const [plan, changedElem] = await planWithTypeChanges()

    expect(plan.size).toBe(1)
    const planItem = getFirstPlanItem(plan)
    expect(planItem.groupKey).toBe(changedElem.elemID.getFullName())
    expect(getChange(planItem, changedElem.elemID).action).toBe('modify')
    expect(planItem.items.size).toBe(1)
  })

  it('should split elements on addition if their fields create a dependency cycle', async () => {
    const [plan, splitElem] = await planWithSplitElem(true)

    const planItems = [...plan.itemsByEvalOrder()]
    expect(planItems).toHaveLength(6)
    const splitElemChanges = planItems
      .filter(item => item.groupKey === splitElem.elemID.getFullName())
    expect(splitElemChanges).toHaveLength(2)
    expect(splitElemChanges[0].action).toEqual('add')
    expect(splitElemChanges[1].action).toEqual('modify')
  })

  it('should split elements on removal if their fields create a dependency cycle', async () => {
    const [plan, splitElem] = await planWithSplitElem(false)

    const planItems = [...plan.itemsByEvalOrder()]
    expect(planItems).toHaveLength(6)
    const splitElemChanges = planItems
      .filter(item => item.groupKey === splitElem.elemID.getFullName())
    expect(splitElemChanges).toHaveLength(2)
    expect(splitElemChanges[0].action).toEqual('modify')
    expect(splitElemChanges[1].action).toEqual('remove')
  })

  it('should fail when plan has dependency cycle', async () => {
    // Without change validators
    await expect(planWithDependencyCycle(false)).rejects.toThrow()
    // With change validators
    await expect(planWithDependencyCycle(true)).rejects.toThrow()
  })

  describe('with custom group key function', () => {
    let plan: Plan
    let changeGroup: PlanItem
    const dummyGroupKeyFunc = mockFunction<ChangeGroupIdFunction>().mockResolvedValue(new Map())
    beforeAll(async () => {
      const before = mock.getAllElements()
      const after = mock.getAllElements()
      // Make two random changes
      after[1].annotations.test = true
      after[2].annotations.test = true
      plan = await getPlan({
        before,
        after,
        customGroupIdFunctions: {
          salto: async changes => new Map([...changes.entries()].map(([changeId]) => [changeId, 'all'])),
          dummy: dummyGroupKeyFunc,
        },
      })
      changeGroup = plan.itemsByEvalOrder()[Symbol.iterator]().next().value
    })

    it('should return only one change group', () => {
      expect(plan.size).toEqual(1)
    })
    it('should return change group with both changes', () => {
      expect(changeGroup).toBeDefined()
      expect([...changeGroup.changes()]).toHaveLength(2)
    })
    it('should not call adapter functions that have no changes', () => {
      expect(dummyGroupKeyFunc).not.toHaveBeenCalled()
    })
  })
})
