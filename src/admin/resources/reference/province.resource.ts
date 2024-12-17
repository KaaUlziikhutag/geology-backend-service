import { ResourceWithOptions } from 'adminjs';
import { referenceNav } from '../../constants.js';
import Province from '../../../modules/reference/address/province.entity.js';
import importExportFeature from '@adminjs/import-export';
import { componentLoader } from '../../component.bundler.js';

const ProvinceResource: ResourceWithOptions = {
  resource: Province,
  options: { navigation: referenceNav, listProperties: ['code', 'name'] },
  features: [importExportFeature({ componentLoader })],
};
export default ProvinceResource;
