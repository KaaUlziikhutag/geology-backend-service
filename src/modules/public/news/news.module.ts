import { Module } from '@nestjs/common';
import { PublicNewsService } from './news.service';
import { PublicNewsController } from './news.contoller';
import PublicNews from './news.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([PublicNews]), ConfigModule],
  controllers: [PublicNewsController],
  providers: [PublicNewsService],
  exports: [PublicNewsService],
})
export class PublicNewsModule {}
