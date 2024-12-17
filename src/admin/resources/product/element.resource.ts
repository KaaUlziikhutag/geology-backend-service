import { ResourceWithOptions } from 'adminjs';
import { productNav } from '../../constants.js';
import Element from '../../../modules/reference/element/element.entity.js';
import importExportFeature from '@adminjs/import-export';
import { componentLoader } from '../../component.bundler.js';

const ElementResource: ResourceWithOptions = {
  resource: Element,
  options: { navigation: productNav, listProperties: ['code', 'name'] },
  features: [importExportFeature({ componentLoader })],
};
export default ElementResource;
