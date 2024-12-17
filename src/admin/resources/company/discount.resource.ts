import { ResourceWithOptions } from 'adminjs';
import { companyNav } from '../../constants.js';
import importExportFeature from '@adminjs/import-export';
import { componentLoader } from '../../component.bundler.js';
import Discount from '../../../modules/reference/discount/discount.entity.js';

const DiscountResource: ResourceWithOptions = {
  resource: Discount,
  options: { navigation: companyNav },
  features: [importExportFeature({ componentLoader })],
};
export default DiscountResource;
