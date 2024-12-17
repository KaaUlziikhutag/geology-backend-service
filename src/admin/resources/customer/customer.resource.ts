import { ResourceWithOptions } from 'adminjs';
import Customer from '../../../modules/customer/customer.entity.js';
import { customerNav } from '../../constants.js';
import { Role } from '../../../utils/enum-utils.js';

const CustomerResource: ResourceWithOptions = {
  resource: Customer,
  options: {
    navigation: customerNav,
    listProperties: ['id', 'type', 'regno', 'name', 'addName'],
    editProperties: [
      'sectionId',
      'directionId',
      'type',
      'regno',
      'name',
      'addName',
      'email',
      'phone',
      'addPhone',
      'provinceId',
      'districtId',
      'address',
    ],
    actions: {
      new: {
        before: async (request) => {
          const adminUser = request['session']['adminUser'];
          request.payload.createdBy = adminUser.userId;
          return request;
        },
        isAccessible: ({ currentAdmin }) => currentAdmin?.role == Role.Admin,
      },
      edit: {
        before: async (request) => {
          const adminUser = request['session']['adminUser'];
          request.payload.updatedBy = adminUser.userId;
          return request;
        },
        isAccessible: ({ currentAdmin }) => currentAdmin?.role == Role.Admin,
      },
      delete: {
        isAccessible: ({ currentAdmin }) => currentAdmin?.role == Role.Admin,
      },
    },
  },
};
export default CustomerResource;
