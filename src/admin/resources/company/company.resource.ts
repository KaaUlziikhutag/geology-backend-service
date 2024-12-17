import { ResourceWithOptions } from 'adminjs';
import { companyNav } from '../../constants.js';
import Company from '../../../modules/company/company.entity.js';
import { Role } from '../../../utils/enum-utils.js';
// import { DISTRICT_SELECT } from '../../component.bundler.js';

const CompanyResource: ResourceWithOptions = {
  resource: Company,
  options: {
    navigation: companyNav,
    actions: {
      new: {
        isAccessible: ({ currentAdmin }) => currentAdmin?.role == Role.Admin,
      },
      edit: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === Role.Admin,
      },
      delete: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === Role.Admin,
      },
    },
    listProperties: [
      'id',
      'regno',
      'name',
      'email',
      'phone',
      'provinceId',
      'districtId',
    ],
  },
};
export default CompanyResource;
