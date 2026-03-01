import { Module } from '@nestjs/common';
import { PublicVoteService } from './vote.service';
import { PublicVoteController } from './vote.contoller';
import PublicVote from './vote.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { VoteQuestionModule } from './question/question.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PublicVote]),
    ConfigModule,
    VoteQuestionModule,
  ],
  controllers: [PublicVoteController],
  providers: [PublicVoteService],
  exports: [PublicVoteService],
})
export class PublicVoteModule {}
