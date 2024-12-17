import { ResourceWithOptions } from 'adminjs';
import LocalFile from '../../../modules/local-files/local-file.entity.js';
import { referenceNav } from '../../constants.js';

const FileResource: ResourceWithOptions = {
  resource: LocalFile,
  options: { navigation: referenceNav },
};
export default FileResource;
