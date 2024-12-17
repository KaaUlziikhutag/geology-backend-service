import { RecordActionResponse, ResourceWithOptions } from 'adminjs';
import Users from '../../../modules/users/users.entity.js';
import { companyNav } from '../../constants.js';
import importExportFeature from '@adminjs/import-export';
import { componentLoader } from '../../component.bundler.js';
import bcrypt from 'bcryptjs';
import { Role } from '../../../utils/enum-utils.js';

const UserResource: ResourceWithOptions = {
  resource: Users,
  options: {
    navigation: companyNav,
    editProperties: [
      'companyId',
      'laboratoryId',
      'email',
      'username',
      'lastName',
      'firstName',
      'phone',
      'role',
      'isActive',
      'password',
    ],
    showProperties: [
      'companyId',
      'laboratoryId',
      'email',
      'username',
      'lastName',
      'firstName',
      'phone',
      'role',
      'isActive',
    ],
    actions: {
      new: {
        before: async (request) => {
          if (request.payload?.password) {
            request.payload.password = await bcrypt.hash(
              request.payload.password,
              10,
            );
          }
          return request;
        },
        isAccessible: ({ currentAdmin }) => currentAdmin?.role == Role.Admin,
      },
      show: {
        after: async (response: RecordActionResponse) => {
          response.record.params.password = '';
          return response;
        },
      },
      edit: {
        before: async (request) => {
          if (request.method === 'post') {
            if (request.payload?.password) {
              request.payload.password = await bcrypt.hash(
                request.payload.password,
                10,
              );
            } else {
              delete request.payload?.password;
            }
          }
          return request;
        },
        after: async (response: RecordActionResponse) => {
          response.record.params.password = '';
          return response;
        },
        isAccessible: ({ currentAdmin }) => currentAdmin.role === Role.Admin,
      },
      delete: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === Role.Admin,
      },
    },
    listProperties: [
      'id',
      'role',
      'laboratoryId',
      'username',
      'firstName',
      'lastName',
      'email',
      'phone',
    ],
  },
  features: [importExportFeature({ componentLoader })],
};
export default UserResource;
