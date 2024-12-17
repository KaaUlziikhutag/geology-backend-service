import { ResourceWithOptions } from 'adminjs';
import { Direction } from '../../../modules/reference/direction/direction.entity.js';
import { customerNav } from '../../constants.js';
import importExportFeature from '@adminjs/import-export';
import { componentLoader } from '../../component.bundler.js';

const DirectionResource: ResourceWithOptions = {
  resource: Direction,
  options: { navigation: customerNav, listProperties: ['code', 'name'] },
  features: [importExportFeature({ componentLoader })],
};
export default DirectionResource;
