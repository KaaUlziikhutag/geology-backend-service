import { NotFoundException } from '@nestjs/common';

export default class TestingResultNotFoundException extends NotFoundException {
  constructor(testingResultId: number) {
    super(`Testing result with id ${testingResultId} not found`);
  }
}
