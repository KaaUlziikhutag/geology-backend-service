import { NotFoundException } from '@nestjs/common';

class GroupsNotFoundException extends NotFoundException {
  constructor(groupId: number) {
    super(`Groups with id ${groupId} not found`);
  }
}

export default GroupsNotFoundException;
