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
import { Values } from '@salto-io/adapter-api'
import {
  CUSTOM_RECORD_TYPE, EMAIL_TEMPLATE, ENTITY_CUSTOM_FIELD, FILE, FOLDER, PATH, ROLE, SCRIPT_ID,
  TRANSACTION_COLUMN_CUSTOM_FIELD, WORKFLOW,
} from '../src/constants'

export const mockDefaultValues: Record<string, Values> = {
  [ENTITY_CUSTOM_FIELD]: {
    [SCRIPT_ID]: 'custentity_slt_e2e_test',
    accesslevel: '2',
    appliestocontact: true,
    appliestocustomer: false,
    appliestoemployee: true,
    appliestogroup: false,
    appliestoothername: false,
    appliestopartner: false,
    appliestopricelist: false,
    appliestoprojecttemplate: false,
    appliestostatement: false,
    appliestovendor: false,
    appliestowebsite: false,
    applyformatting: false,
    availableexternally: false,
    checkspelling: true,
    defaultchecked: false,
    defaultvalue: 'None',
    description: 'e2e test entitycustomfield description',
    displaytype: 'NORMAL',
    encryptatrest: false,
    fieldtype: 'CHECKBOX',
    globalsearch: false,
    isformula: false,
    ismandatory: false,
    isparent: false,
    label: 'TestEntityCustomField',
    searchlevel: '2',
    showhierarchy: false,
    showinlist: false,
    storevalue: true,
  },
  [ROLE]: {
    [SCRIPT_ID]: 'customrole_slt_e2e_test',
    centertype: 'BASIC',
    employeerestriction: 'NONE',
    issalesrole: false,
    issupportrole: false,
    iswebserviceonlyrole: false,
    name: 'TestRole',
    restrictbydevice: false,
    restricttimeandexpenses: false,
    permissions: {
      permission: [
        {
          permkey: 'LIST_FILECABINET',
          permlevel: 'FULL',
        },
      ],
    },
  },
  [CUSTOM_RECORD_TYPE]: {
    [SCRIPT_ID]: 'customrecord_slt_e2e_test',
    accesstype: 'CUSTRECORDENTRYPERM',
    allowattachments: true,
    allowinlinedeleting: false,
    allowinlinedetaching: true,
    allowinlineediting: false,
    allowmobileaccess: true,
    allownumberingoverride: false,
    allowquickadd: false,
    allowquicksearch: false,
    allowuiaccess: true,
    description: 'e2e test customrecordtype description',
    enabledle: true,
    enablekeywords: true,
    enablemailmerge: false,
    enablenametranslation: false,
    enablenumbering: false,
    enableoptimisticlocking: true,
    enablesystemnotes: true,
    hierarchical: false,
    iconbuiltin: false,
    includeinsearchmenu: true,
    includename: true,
    isinactive: false,
    isordered: false,
    recordname: 'custom record name',
    showcreationdate: false,
    showcreationdateonlist: false,
    showid: false,
    showlastmodified: false,
    showlastmodifiedonlist: false,
    shownotes: true,
    showowner: false,
    showownerallowchange: false,
    showowneronlist: false,
    customrecordcustomfields: {
      customrecordcustomfield: [
        {
          scriptid: 'custrecord_field1',
          accesslevel: '1',
          allowquickadd: false,
          applyformatting: false,
          checkspelling: false,
          defaultchecked: false,
          description: 'field 1 description',
          displaytype: 'NORMAL',
          encryptatrest: false,
          fieldtype: 'TEXT',
          globalsearch: false,
          isformula: false,
          ismandatory: false,
          isparent: false,
          label: 'Field 1',
          rolerestrict: false,
          searchlevel: '1',
          showinlist: false,
          storevalue: true,
        },
        {
          scriptid: 'custrecord_field2',
          accesslevel: '2',
          allowquickadd: false,
          applyformatting: true,
          checkspelling: false,
          defaultchecked: false,
          description: 'field 2 description',
          displaytype: 'NORMAL',
          encryptatrest: false,
          fieldtype: 'PERCENT',
          globalsearch: false,
          isformula: false,
          ismandatory: false,
          isparent: false,
          label: 'Field 2',
          rolerestrict: false,
          searchlevel: '2',
          showinlist: false,
          storevalue: true,
        },
      ],
    },
  },
  [WORKFLOW]: {
    [SCRIPT_ID]: 'customworkflow_slt_e2e_test',
    description: 'e2e test workflow description',
    initcontexts: 'ACTION|BANKCONNECTIVITY|BANKSTATEMENTPARSER|BUNDLEINSTALLATION|CLIENT|CSVIMPORT|CUSTOMGLLINES|CUSTOMMASSUPDATE|DEBUGGER|EMAILCAPTURE|FICONNECTIVITY|MAPREDUCE|OFFLINECLIENT|OTHER|PAYMENTPOSTBACK|PAYMENTGATEWAY|PLATFORMEXTENSION|PORTLET|PROMOTIONS|CONSOLRATEADJUSTOR|RESTWEBSERVICES|RESTLET|ADVANCEDREVREC|SCHEDULED|SDFINSTALLATION|SHIPPINGPARTNERS|WEBSERVICES|SUITELET|TAXCALCULATION|USEREVENT|USERINTERFACE|WORKFLOW',
    initeventtypes: 'APPROVE|CANCEL',
    initoncreate: true,
    initonvieworupdate: false,
    inittriggertype: 'BEFORESUBMIT',
    isinactive: false,
    islogenabled: false,
    keephistory: 'ONLYWHENTESTING',
    name: 'workflow name',
    recordtypes: 'CASHREFUND',
    releasestatus: 'NOTINITIATING',
    runasadmin: true,
    initcondition: {
      type: 'VISUAL_BUILDER',
    },
    workflowcustomfields: {
      workflowcustomfield: [
        {
          scriptid: 'custworkflow_field1',
          applyformatting: false,
          defaultchecked: false,
          displaytype: 'NORMAL',
          fieldtype: 'SELECT',
          label: 'Approver',
          selectrecordtype: '-4',
          storevalue: true,
        },
        {
          scriptid: 'custworkflow_field2',
          applyformatting: false,
          defaultchecked: false,
          displaytype: 'NORMAL',
          fieldtype: 'SELECT',
          label: 'Created By',
          selectrecordtype: '-4',
          storevalue: true,
        },
      ],
    },
    workflowstates: {
      workflowstate: [
        {
          scriptid: 'workflowstate_state1',
          donotexitworkflow: false,
          name: 'Initiation',
          positionx: 133,
          positiony: 113,
          workflowactions: [
            {
              triggertype: 'ONENTRY',
              setfieldvalueaction: [
                {
                  scriptid: 'workflowaction_action1',
                  contexttypes: 'ACTION|BANKCONNECTIVITY|BANKSTATEMENTPARSER|BUNDLEINSTALLATION|CLIENT|CSVIMPORT|CUSTOMGLLINES|CUSTOMMASSUPDATE|DEBUGGER|EMAILCAPTURE|FICONNECTIVITY|MAPREDUCE|OFFLINECLIENT|OTHER|PAYMENTPOSTBACK|PAYMENTGATEWAY|PLATFORMEXTENSION|PORTLET|PROMOTIONS|CONSOLRATEADJUSTOR|RESTWEBSERVICES|RESTLET|ADVANCEDREVREC|SCHEDULED|SDFINSTALLATION|SHIPPINGPARTNERS|WEBSERVICES|SUITELET|TAXCALCULATION|USEREVENT|USERINTERFACE|WORKFLOW',
                  field: 'STDBODYAPPROVED',
                  isinactive: false,
                  schedulemode: 'DELAY',
                  valuechecked: false,
                  valuetype: 'STATIC',
                  initcondition: {
                    type: 'VISUAL_BUILDER',
                  },
                },
              ],
            },
          ],
          workflowtransitions: {
            workflowtransition: [
              {
                scriptid: 'workflowtransition_transition1',
                contexttypes: 'ACTION|BANKCONNECTIVITY|BANKSTATEMENTPARSER|BUNDLEINSTALLATION|CLIENT|CSVIMPORT|CUSTOMGLLINES|CUSTOMMASSUPDATE|DEBUGGER|EMAILCAPTURE|FICONNECTIVITY|MAPREDUCE|OFFLINECLIENT|OTHER|PAYMENTPOSTBACK|PAYMENTGATEWAY|PLATFORMEXTENSION|PORTLET|PROMOTIONS|CONSOLRATEADJUSTOR|RESTWEBSERVICES|RESTLET|ADVANCEDREVREC|SCHEDULED|SDFINSTALLATION|SHIPPINGPARTNERS|WEBSERVICES|SUITELET|TAXCALCULATION|USEREVENT|USERINTERFACE|WORKFLOW',
                tostate: 'change me to reference => netsuite.workflow.instance.customworkflow_slt_e2e_test.workflowstates.workflowstate.1.scriptid',
                triggertype: 'BEFORESUBMIT',
                initcondition: {
                  type: 'VISUAL_BUILDER',
                },
              },
            ],
          },
        },
        {
          scriptid: 'workflowstate_state2',
          donotexitworkflow: true,
          name: 'Approved',
          positionx: 133,
          positiony: 293,
          workflowactions: [
            {
              triggertype: 'ONENTRY',
              setfieldvalueaction: [
                {
                  scriptid: 'workflowaction_action2',
                  contexttypes: 'ACTION|BANKCONNECTIVITY|BANKSTATEMENTPARSER|BUNDLEINSTALLATION|CLIENT|CSVIMPORT|CUSTOMGLLINES|CUSTOMMASSUPDATE|DEBUGGER|EMAILCAPTURE|FICONNECTIVITY|MAPREDUCE|OFFLINECLIENT|OTHER|PAYMENTPOSTBACK|PAYMENTGATEWAY|PLATFORMEXTENSION|PORTLET|PROMOTIONS|CONSOLRATEADJUSTOR|RESTWEBSERVICES|RESTLET|ADVANCEDREVREC|SCHEDULED|SDFINSTALLATION|SHIPPINGPARTNERS|WEBSERVICES|SUITELET|TAXCALCULATION|USEREVENT|USERINTERFACE|WORKFLOW',
                  field: 'STDBODYAPPROVED',
                  isinactive: false,
                  schedulemode: 'DELAY',
                  valuechecked: true,
                  valuetype: 'STATIC',
                  initcondition: {
                    type: 'VISUAL_BUILDER',
                  },
                },
              ],
            },
            {
              triggertype: 'BEFORELOAD',
              lockrecordaction: [
                {
                  scriptid: 'workflowaction_action3',
                  contexttypes: 'ACTION|BANKCONNECTIVITY|BANKSTATEMENTPARSER|BUNDLEINSTALLATION|CLIENT|CSVIMPORT|CUSTOMGLLINES|CUSTOMMASSUPDATE|DEBUGGER|EMAILCAPTURE|FICONNECTIVITY|MAPREDUCE|OFFLINECLIENT|OTHER|PAYMENTPOSTBACK|PAYMENTGATEWAY|PLATFORMEXTENSION|PORTLET|PROMOTIONS|CONSOLRATEADJUSTOR|RESTWEBSERVICES|RESTLET|ADVANCEDREVREC|SCHEDULED|SDFINSTALLATION|SHIPPINGPARTNERS|WEBSERVICES|SUITELET|TAXCALCULATION|USEREVENT|USERINTERFACE|WORKFLOW',
                  isinactive: false,
                  initcondition: {
                    formula: '"User Role" NOT IN ("Role1")',
                    type: 'VISUAL_BUILDER',
                    parameters: {
                      parameter: [
                        {
                          name: 'User Role',
                          value: 'STDUSERROLE',
                        },
                        {
                          name: 'Role1',
                          selectrecordtype: '-118',
                          value: 'ADMINISTRATOR',
                        },
                      ],
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  },
  [TRANSACTION_COLUMN_CUSTOM_FIELD]: {
    [SCRIPT_ID]: 'custcol_slt_e2e_test',
    accesslevel: '1',
    applyformatting: false,
    colexpense: false,
    colexpensereport: false,
    colgrouponinvoices: false,
    colinventoryadjustment: false,
    colitemfulfillment: false,
    colitemfulfillmentorder: 'F',
    colitemreceipt: false,
    colitemreceiptorder: 'F',
    coljournal: false,
    colkititem: false,
    colopportunity: false,
    colpackingslip: false,
    colpickingticket: false,
    colprintflag: false,
    colpurchase: false,
    colreturnform: false,
    colsale: true,
    colstore: false,
    colstorehidden: false,
    colstorewithgroups: false,
    coltime: false,
    coltransferorder: false,
    defaultchecked: false,
    description: 'e2e test transactioncolumncustomfield description',
    displaytype: 'NORMAL',
    encryptatrest: false,
    fieldtype: 'CHECKBOX',
    isformula: false,
    ismandatory: false,
    label: 'transactioncolumncustomfield label',
    searchlevel: '2',
    showhierarchy: false,
    sourcefrom: 'change me to reference to entitycustomfield!!',
    sourcelist: 'STDBODYENTITY',
    storevalue: true,
  },
  [EMAIL_TEMPLATE]: {
    [SCRIPT_ID]: 'custemailtmpl_slt_e2e_test',
    addcompanyaddress: false,
    addunsubscribelink: false,
    isinactive: false,
    isprivate: false,
    name: 'email template name',
    recordtype: 'TRANSACTION',
    subject: 'email subject',
    usesmedia: false,
    content: 'Email Template Content',
  },
  [FOLDER]: {
    [PATH]: '/SuiteScripts/InnerFolder',
    bundleable: true,
    description: 'e2e test folder description',
    isinactive: false,
    isprivate: false,
  },
  [FILE]: {
    [PATH]: '/SuiteScripts/InnerFolder/e2eTest.js',
    availablewithoutlogin: false,
    bundleable: true,
    description: 'e2e test file description',
    generateurltimestamp: false,
    hideinbundle: false,
    isinactive: false,
    content: 'File Content',
  },
}