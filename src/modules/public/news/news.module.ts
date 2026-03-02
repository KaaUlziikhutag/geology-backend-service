import { Module } from '@nestjs/common';
import { PublicNewsService } from './news.service';
import { PublicNewsController } from './news.contoller';
import PublicNews from './news.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserView } from './entities/user-views.entity';
import { Comments } from './entities/comment.entity';
import UserLimit from '@modules/shared/access/entities/user-limit.entity';
import { NewsLikeModule } from '@modules/shared/like/like.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PublicNews, Comments, UserLimit, UserView]),
    ConfigModule,
    NewsLikeModule,
  ],
  controllers: [PublicNewsController],
  providers: [PublicNewsService],
  exports: [PublicNewsService],
})
export class PublicNewsModule {}
