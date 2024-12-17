import { ResourceWithOptions } from 'adminjs';
import { companyNav } from '../../constants.js';
import importExportFeature from '@adminjs/import-export';
import { componentLoader } from '../../component.bundler.js';
import { Role } from '../../../utils/enum-utils.js';
import Decision from '../../../modules/decision/decision.entity.js';

const DecisionResource: ResourceWithOptions = {
  resource: Decision,
  options: {
    navigation: companyNav,
    editProperties: ['companyId', 'name', 'ruleAt'],
    actions: {
      new: {
        before: async (request) => {
          const adminUser = request['session']['adminUser'];
          request.payload.createdBy = adminUser.userId;
          return request;
        },
        isAccessible: ({ currentAdmin }) => currentAdmin.role === Role.Admin,
      },
      edit: {
        before: async (request) => {
          const adminUser = request['session']['adminUser'];
          request.payload.updatedBy = adminUser.userId;
          return request;
        },
        isAccessible: ({ currentAdmin }) => currentAdmin.role === Role.Admin,
      },
      delete: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === Role.Admin,
      },
    },
  },
  features: [importExportFeature({ componentLoader })],
};
export default DecisionResource;
