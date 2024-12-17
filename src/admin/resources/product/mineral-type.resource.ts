import { ResourceWithOptions } from 'adminjs';
import MineralType from '../../../modules/reference/mineral-type/mineral-type.entity.js';
import { productNav } from '../../constants.js';
import importExportFeature from '@adminjs/import-export';
import { componentLoader } from '../../component.bundler.js';

const MineralTypeResource: ResourceWithOptions = {
  resource: MineralType,
  options: { navigation: productNav, listProperties: ['code', 'name'] },
  features: [importExportFeature({ componentLoader })],
};
export default MineralTypeResource;
