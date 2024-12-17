import { ResourceWithOptions } from 'adminjs';
import Order from '../../../modules/order/order.entity.js';
import { customerNav } from '../../constants.js';

const OrderResource: ResourceWithOptions = {
  resource: Order,
  options: {
    navigation: customerNav,
    actions: {
      new: { isAccessible: false },
      edit: { isAccessible: false },
      delete: { isAccessible: false },
    },
  },
};
export default OrderResource;
