import { ResourceWithOptions } from 'adminjs';
import { companyNav } from '../../constants.js';
import importExportFeature from '@adminjs/import-export';
import { componentLoader } from '../../component.bundler.js';
import Contract from '../../../modules/contract/contract.entity.js';
import { Role } from '../../../utils/enum-utils.js';

const ContractResource: ResourceWithOptions = {
  resource: Contract,
  options: {
    navigation: companyNav,
    actions: {
      new: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === Role.Admin,
      },
      edit: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === Role.Admin,
      },
      delete: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === Role.Admin,
      },
    },
  },
  features: [importExportFeature({ componentLoader })],
};
export default ContractResource;
