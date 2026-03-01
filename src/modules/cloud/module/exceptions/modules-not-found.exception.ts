import { NotFoundException } from '@nestjs/common';

class ModuleNotFoundException extends NotFoundException {
  constructor(moduleId: number) {
    super(`Module with id ${moduleId} not found`);
  }
}

export default ModuleNotFoundException;
