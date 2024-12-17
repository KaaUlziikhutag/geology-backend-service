import { ResourceWithOptions } from 'adminjs';
import PaymentDetail from '../../../modules/payment/payment-detail/payment-detail.entity.js';
import { paymentNav } from '../../constants.js';

const PaymentDtlResource: ResourceWithOptions = {
  resource: PaymentDetail,
  options: {
    navigation: paymentNav,
    listProperties: ['id', 'paymentId', 'type', 'paidAmount'],
    actions: {
      new: { isAccessible: false },
      edit: { isAccessible: false },
      delete: { isAccessible: false },
    },
  },
};
export default PaymentDtlResource;
