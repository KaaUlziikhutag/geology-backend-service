import { ResourceWithOptions } from 'adminjs';
import Mineral from '../../../modules/appointment/mineral/mineral.entity.js';
import { customerNav } from '../../constants.js';

const MineralResource: ResourceWithOptions = {
  resource: Mineral,
  options: {
    navigation: customerNav,
    listProperties: ['id', 'appointmentId', 'mineralTypeId', 'name', 'weight'],
    actions: {
      new: { isAccessible: false },
      edit: { isAccessible: false },
      delete: { isAccessible: false },
    },
  },
};
export default MineralResource;
