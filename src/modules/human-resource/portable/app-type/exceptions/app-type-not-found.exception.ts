import { NotFoundException } from '@nestjs/common';

class AppTypeNotFoundException extends NotFoundException {
  constructor(appTypeId: number) {
    super(`AppType with id ${appTypeId} not found`);
  }
}

export default AppTypeNotFoundException;
