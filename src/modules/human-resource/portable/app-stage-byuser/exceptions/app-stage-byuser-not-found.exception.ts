import { NotFoundException } from '@nestjs/common';

class AppStageByUserNotFoundException extends NotFoundException {
  constructor(appStageByUserId: number) {
    super(`appStageByUser with id ${appStageByUserId} not found`);
  }
}

export default AppStageByUserNotFoundException;
