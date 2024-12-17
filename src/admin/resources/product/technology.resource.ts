import { ResourceWithOptions } from 'adminjs';
import Technology from '../../../modules/reference/technology/technology.entity.js';
import { productNav } from '../../constants.js';
import importExportFeature from '@adminjs/import-export';
import { componentLoader } from '../../component.bundler.js';

const TechnologyResource: ResourceWithOptions = {
  resource: Technology,
  options: { navigation: productNav, listProperties: ['code', 'name'] },
  features: [importExportFeature({ componentLoader })],
};
export default TechnologyResource;
