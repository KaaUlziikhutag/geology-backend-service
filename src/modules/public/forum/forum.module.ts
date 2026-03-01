import { Module } from '@nestjs/common';
import { PublicForumService } from './forum.service';
import { PublicForumController } from './forum.contoller';
import PublicForum from './forum.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { VoteQuestionModule } from '../vote/question/question.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PublicForum]),
    ConfigModule,
    VoteQuestionModule,
  ],
  controllers: [PublicForumController],
  providers: [PublicForumService],
  exports: [PublicForumService],
})
export class PublicForumModule {}
