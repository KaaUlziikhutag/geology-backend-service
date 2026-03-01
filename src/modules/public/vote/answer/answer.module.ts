import { Module } from '@nestjs/common';
import { VoteAnswerService } from './answer.service';
import { VoteAnswerController } from './answer.contoller';
import VoteAnswer from './answer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([VoteAnswer]), ConfigModule],
  controllers: [VoteAnswerController],
  providers: [VoteAnswerService],
  exports: [VoteAnswerService],
})
export class VoteAnswerModule {}
