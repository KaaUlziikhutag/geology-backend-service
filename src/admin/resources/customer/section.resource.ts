import { ResourceWithOptions } from 'adminjs';
import SectionCustomer from '../../../modules/reference/section-customer/section-customer.entity.js';
import { customerNav } from '../../constants.js';
import importExportFeature from '@adminjs/import-export';
import { componentLoader } from '../../component.bundler.js';

const SectionCustomerResource: ResourceWithOptions = {
  resource: SectionCustomer,
  options: { navigation: customerNav, listProperties: ['code', 'name'] },
  features: [importExportFeature({ componentLoader })],
};
export default SectionCustomerResource;
