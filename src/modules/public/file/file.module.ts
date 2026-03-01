import { Module } from '@nestjs/common';
import { PublicFileService } from './file.service';
import { PublicFileController } from './file.contoller';
import PublicFiles from './file.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([PublicFiles]), ConfigModule],
  controllers: [PublicFileController],
  providers: [PublicFileService],
  exports: [PublicFileService],
})
export class PublicFileModule {}
