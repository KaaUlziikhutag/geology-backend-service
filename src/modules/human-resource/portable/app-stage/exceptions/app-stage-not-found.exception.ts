import { NotFoundException } from '@nestjs/common';

class AppStageNotFoundException extends NotFoundException {
  constructor(appStageId: number) {
    super(`appStage with id ${appStageId} not found`);
  }
}

export default AppStageNotFoundException;
