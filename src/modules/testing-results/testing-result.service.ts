import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import TestingResult from './testing-result.entity';
import { Repository } from 'typeorm';
import GetUserDto from '../users/dto/get-user.dto';
import { CreateTestingResultDto } from './dto/create-testing-result.dto';
import TestingResultNotFoundException from './exceptions/testing-result-not-found.exception';

@Injectable()
export class TestingResultService {
  constructor(
    @InjectRepository(TestingResult)
    private readonly resultRepository: Repository<TestingResult>,
  ) {}

  async createTestingResult(
    user: GetUserDto,
    testingResult: CreateTestingResultDto,
  ): Promise<TestingResult> {
    const newTestingResult = this.resultRepository.create({
      ...testingResult,
      createdBy: user.id,
    });
    return await this.resultRepository.save(newTestingResult);
  }

  async getTestingResultById(id: number): Promise<TestingResult> {
    const testingResult = await this.resultRepository.findOne({
      where: { id },
    });
    if (testingResult) {
      return testingResult;
    }
    throw new TestingResultNotFoundException(id);
  }
}
