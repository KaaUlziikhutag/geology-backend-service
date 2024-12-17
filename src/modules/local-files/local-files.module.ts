import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import LocalFile from './local-file.entity.js';
import LocalFilesService from './local-files.service.js';
import LocalFilesController from './local-files.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([LocalFile]), ConfigModule],
  providers: [LocalFilesService],
  exports: [LocalFilesService],
  controllers: [LocalFilesController],
})
export class LocalFilesModule {}
