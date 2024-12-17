import { ResourceWithOptions } from 'adminjs';
import { productNav } from '../../constants.js';
import Price from '../../../modules/price/price.entity.js';
import importExportFeature from '@adminjs/import-export';
import { componentLoader } from '../../component.bundler.js';

const PriceResource: ResourceWithOptions = {
  resource: Price,
  options: {
    navigation: productNav,
  },
  features: [importExportFeature({ componentLoader })],
};
export default PriceResource;
