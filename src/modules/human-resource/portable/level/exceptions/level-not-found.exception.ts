import { NotFoundException } from '@nestjs/common';

class LevelNotFoundException extends NotFoundException {
  constructor(levelId: number) {
    super(`Level with id ${levelId} not found`);
  }
}

export default LevelNotFoundException;
