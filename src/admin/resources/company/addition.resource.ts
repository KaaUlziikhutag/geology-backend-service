import { ResourceWithOptions } from 'adminjs';
import { companyNav } from '../../constants.js';
import importExportFeature from '@adminjs/import-export';
import { componentLoader } from '../../component.bundler.js';
import Addition from '../../../modules/reference/addition/addition.entity.js';

const AdditionResource: ResourceWithOptions = {
  resource: Addition,
  options: { navigation: companyNav },
  features: [importExportFeature({ componentLoader })],
};
export default AdditionResource;
