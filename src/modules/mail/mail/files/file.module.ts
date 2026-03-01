import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import Files from './file.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Files]), ConfigModule],
  providers: [FileService],
  exports: [FileService],
})
export class MailFileModule {}
