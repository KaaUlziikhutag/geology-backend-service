import { ResourceWithOptions } from 'adminjs';
import Appointment from '../../../modules/appointment/appointment.entity.js';
import { customerNav } from '../../constants.js';

const AppointmentResource: ResourceWithOptions = {
  resource: Appointment,
  options: {
    navigation: customerNav,
    listProperties: ['id', 'code', 'customerId', 'warehouseId'],
    actions: {
      new: { isAccessible: false },
      edit: { isAccessible: false },
      delete: { isAccessible: false },
    },
  },
};
export default AppointmentResource;
