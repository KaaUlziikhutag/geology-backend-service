import { ResourceWithOptions } from 'adminjs';
import { productNav } from '../../constants.js';
import Product from '../../../modules/product/product.entity.js';
import importExportFeature from '@adminjs/import-export';
import { componentLoader } from '../../component.bundler.js';

const properties = [
  'sectionId',
  'code',
  'name',
  'type',
  'classificationId',
  'taxType',
];
const ProductResource: ResourceWithOptions = {
  resource: Product,
  options: {
    navigation: productNav,
    listProperties: properties,
    editProperties: properties,
    showProperties: properties,
  },
  features: [importExportFeature({ componentLoader })],
};
export default ProductResource;
