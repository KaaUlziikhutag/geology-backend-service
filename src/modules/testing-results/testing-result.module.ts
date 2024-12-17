import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import TestingResult from './testing-result.entity.js';
import ResultIndicator from './result-indicator.entity.js';
import { TestingResultService } from './testing-result.service.js';
import { TestingResultController } from './testing-result.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([TestingResult, ResultIndicator])],
  providers: [TestingResultService],
  controllers: [TestingResultController],
})
export class TestingResultModule {}
