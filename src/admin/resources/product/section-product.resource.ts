import { ResourceWithOptions } from 'adminjs';
import { productNav } from '../../constants.js';
import importExportFeature from '@adminjs/import-export';
import { componentLoader } from '../../component.bundler.js';
import SectionProduct from '../../../modules/reference/section-product/section-product.entity.js';

const SectionProductResource: ResourceWithOptions = {
  resource: SectionProduct,
  options: { navigation: productNav, listProperties: ['code', 'name'] },
  features: [importExportFeature({ componentLoader })],
};
export default SectionProductResource;
