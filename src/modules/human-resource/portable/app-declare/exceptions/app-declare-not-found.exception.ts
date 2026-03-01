import { NotFoundException } from '@nestjs/common';

class AppDeclareNotFoundException extends NotFoundException {
  constructor(appDeclareId: number) {
    super(`appDeclare with id ${appDeclareId} not found`);
  }
}

export default AppDeclareNotFoundException;
