import { ResourceWithOptions } from 'adminjs';
import Warehouse from '../../../modules/customer/warehouse/warehouse.entity.js';
import { customerNav } from '../../constants.js';

const WarehouseResource: ResourceWithOptions = {
  resource: Warehouse,
  options: {
    navigation: customerNav,
    listProperties: ['id', 'customerId', 'code', 'name'],
    actions: {
      new: { isAccessible: false },
      edit: { isAccessible: false },
      delete: { isAccessible: false },
    },
  },
};
export default WarehouseResource;
