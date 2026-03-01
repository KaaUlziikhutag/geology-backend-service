import { Module } from '@nestjs/common';
import { VoteQuestionService } from './question.service';
import { VoteQuestionController } from './question.contoller';
import VoteQuestion from './question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([VoteQuestion]), ConfigModule],
  controllers: [VoteQuestionController],
  providers: [VoteQuestionService],
  exports: [VoteQuestionService],
})
export class VoteQuestionModule {}
