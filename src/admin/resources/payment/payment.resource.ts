import { ResourceWithOptions } from 'adminjs';
import Payment from '../../../modules/payment/payment.entity.js';
import { paymentNav } from '../../constants.js';

const PaymentResource: ResourceWithOptions = {
  resource: Payment,
  options: {
    navigation: paymentNav,
    listProperties: ['id', 'customerId', 'type', 'totalAmount'],
    showProperties: ['id', 'customerId', 'type', 'totalAmount'],
    actions: {
      new: { isAccessible: false },
      edit: { isAccessible: false },
      delete: { isAccessible: false },
    },
  },
};
export default PaymentResource;
