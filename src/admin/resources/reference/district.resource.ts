import { ResourceWithOptions } from 'adminjs';
import { referenceNav } from '../../constants.js';
import District from '../../../modules/reference/address/district.entity.js';
import importExportFeature from '@adminjs/import-export';
import { componentLoader } from '../../component.bundler.js';

const DistrictResource: ResourceWithOptions = {
  resource: District,
  options: {
    navigation: referenceNav,
    listProperties: ['provinceId', 'code', 'name'],
  },
  features: [importExportFeature({ componentLoader })],
};
export default DistrictResource;
