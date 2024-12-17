import { ResourceWithOptions } from 'adminjs';
import { referenceNav } from '../../constants.js';
import Classification from '../../../modules/reference/classification/classification.entity.js';
import importExportFeature from '@adminjs/import-export';
import { componentLoader } from '../../component.bundler.js';

const ClassificationResource: ResourceWithOptions = {
  resource: Classification,
  options: { navigation: referenceNav, listProperties: ['code', 'name'] },
  features: [importExportFeature({ componentLoader })],
};
export default ClassificationResource;
