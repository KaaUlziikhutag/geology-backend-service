import { ResourceWithOptions } from 'adminjs';
import { productNav } from '../../constants.js';
import importExportFeature from '@adminjs/import-export';
import { componentLoader } from '../../component.bundler.js';
import Measurement from '../../../modules/reference/measurement/measurement.entity.js';

const MeasurementResource: ResourceWithOptions = {
  resource: Measurement,
  options: { navigation: productNav, listProperties: ['code', 'name'] },
  features: [importExportFeature({ componentLoader })],
};
export default MeasurementResource;
