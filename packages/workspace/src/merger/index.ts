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
import {
  ObjectType, isType, isObjectType, isInstanceElement, Element, ContainerType,
  isPrimitiveType, BuiltinTypes, TypeMap, ListType, isListType, isVariable, isContainerType,
} from '@salto-io/adapter-api'
import { logger } from '@salto-io/logging'
import { mergeObjectTypes } from './internal/object_types'
import { mergeInstances } from './internal/instances'
import { mergeVariables } from './internal/variables'
import { mergePrimitives } from './internal/primitives'
import { MergeResult as InternalMergeResult } from './internal/common'

export { MergeError, DuplicateAnnotationError } from './internal/common'
export type MergeResult = InternalMergeResult<Element[]>

const log = logger(module)

/**
 * Replace the pointers to all the merged elements to the merged version.
 */
export const updateMergedTypes = (
  elements: Element[],
  mergedTypes: TypeMap
): Element[] => elements.map(elem => {
  if (isType(elem)) {
    elem.annotationTypes = _.mapValues(
      elem.annotationTypes,
      anno => mergedTypes[anno.elemID.getFullName()] || anno,
    )
  }
  if (isObjectType(elem)) {
    elem.fields = _.mapValues(
      elem.fields,
      field => {
        field.type = mergedTypes[field.type.elemID.getFullName()] || field.type
        const fieldType = field.type
        if (isListType(fieldType)) {
          const resolveListType = (listType: ListType): void => {
            if (isListType(listType.innerType)) {
              resolveListType(listType.innerType)
            } else {
              listType.setInnerType(mergedTypes[listType.innerType.elemID.getFullName()]
              || listType.innerType)
            }
          }
          resolveListType(fieldType)
        }
        return field
      }
    )
  }
  if (isInstanceElement(elem)) {
    elem.type = mergedTypes[elem.type.elemID.getFullName()] as ObjectType || elem.type
  }
  return elem
})

const getContainerTypes = (containerTypes: ContainerType[]): Record<string, ListType> =>
  _.keyBy(containerTypes, type => type.elemID.getFullName())

/**
 * Merge a list of elements by applying all updates, and replacing the pointers
 * to the updated elements.
 */
export const mergeElements = (elements: ReadonlyArray<Element>): MergeResult => {
  const objects = mergeObjectTypes(elements.filter(isObjectType))
  const instances = mergeInstances(elements.filter(isInstanceElement))
  const primitiveElements = [...elements.filter(isPrimitiveType), ...Object.values(BuiltinTypes)]
  const primitives = mergePrimitives(primitiveElements)
  const listTypes = getContainerTypes(elements.filter(isContainerType))
  const variables = mergeVariables(elements.filter(isVariable))

  const mergedElements = [
    ...elements.filter(e => !isObjectType(e) && !isInstanceElement(e) && !isVariable(e)),
    ...Object.values(objects.merged),
    ...instances.merged,
    ...variables.merged,
  ]

  const updated = updateMergedTypes(
    mergedElements,
    _.merge({}, objects.merged, primitives.merged, listTypes)
  )

  const errors = [
    ...objects.errors,
    ...instances.errors,
    ...primitives.errors,
    ...variables.errors,
  ]

  log.debug(`merged ${elements.length} elements to ${updated.length} elements [errors=${
    errors.length}]`)
  if (errors.length > 0) {
    log.debug(`All merge errors:\n${errors.map(err => err.message).join('\n')}`)
  }
  return {
    merged: updated,
    errors,
  }
}
