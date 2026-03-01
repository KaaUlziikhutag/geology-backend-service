import { Module } from '@nestjs/common';
import { PagesService } from './pages.service';
import { PagesController } from './pages.contoller';
import Pagess from './pages.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Pagess]), ConfigModule],
  controllers: [PagesController],
  providers: [PagesService],
  exports: [PagesService],
})
export class PagesModule {}
