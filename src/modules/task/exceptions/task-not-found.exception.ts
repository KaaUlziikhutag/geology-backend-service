import { NotFoundException } from '@nestjs/common';

export default class TaskNotFoundException extends NotFoundException {
  constructor(taskId: number) {
    super(`Task with id ${taskId} not found`);
  }
}
