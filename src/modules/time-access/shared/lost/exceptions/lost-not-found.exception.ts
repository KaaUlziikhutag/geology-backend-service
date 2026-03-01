import { NotFoundException } from '@nestjs/common';

class DirectLostNotFoundException extends NotFoundException {
  constructor(directLostId: number) {
    super(`DirectLost with id ${directLostId} not found`);
  }
}

export default DirectLostNotFoundException;
