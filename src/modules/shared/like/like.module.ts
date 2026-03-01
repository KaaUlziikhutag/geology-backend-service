import { Module } from '@nestjs/common';
import { NewsLikeService } from './like.service';
import { NewsLikeController } from './like.contoller';
import NewsLike from './like.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([NewsLike]), ConfigModule],
  controllers: [NewsLikeController],
  providers: [NewsLikeService],
  exports: [NewsLikeService],
})
export class NewsLikeModule {}
