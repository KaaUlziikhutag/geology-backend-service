import { NotFoundException } from '@nestjs/common';

class TreeNotFoundException extends NotFoundException {
  constructor(treeId: number) {
    super(`Tree with id ${treeId} not found`);
  }
}

export default TreeNotFoundException;
