import { ResourceWithOptions } from 'adminjs';
import Laboratory from '../../../modules/reference/laboratory/laboratory.entity.js';
import { productNav } from '../../constants.js';
import importExportFeature from '@adminjs/import-export';
import { componentLoader } from '../../component.bundler.js';

const LaboratoryResource: ResourceWithOptions = {
  resource: Laboratory,
  options: { navigation: productNav, listProperties: ['code', 'name'] },
  features: [importExportFeature({ componentLoader })],
};
export default LaboratoryResource;
