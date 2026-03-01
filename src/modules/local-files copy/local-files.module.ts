import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import LocalFilesController from './local-files.controller';
import LocalFilesService from './files.service';
import GlobalFilesController from './global-files.controller';
import GlobalFile from './global-file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GlobalFile]), // Register LocalFileRepository here
    ConfigModule,
  ],
  providers: [LocalFilesService],
  exports: [LocalFilesService],
  controllers: [LocalFilesController, GlobalFilesController],
})
export class LocalFilesModule {}
