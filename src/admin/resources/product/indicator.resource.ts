import { ResourceWithOptions } from 'adminjs';
import { productNav } from '../../constants.js';
import importExportFeature from '@adminjs/import-export';
import { componentLoader } from '../../component.bundler.js';
import Indicator from '../../../modules/indicator/indicator.entity.js';

const IndicatorResource: ResourceWithOptions = {
  resource: Indicator,
  options: { navigation: productNav },
  features: [importExportFeature({ componentLoader })],
};
export default IndicatorResource;
