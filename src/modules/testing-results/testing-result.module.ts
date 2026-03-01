import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import TestingResult from './testing-result.entity';
import ResultIndicator from './result-indicator.entity';
import { TestingResultService } from './testing-result.service';
import { TestingResultController } from './testing-result.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TestingResult, ResultIndicator])],
  providers: [TestingResultService],
  controllers: [TestingResultController],
})
export class TestingResultModule {}
