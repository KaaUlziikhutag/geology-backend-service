import { Module } from '@nestjs/common';
import { MailUserService } from './users.service';
import MailUser from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([MailUser]), ConfigModule],
  providers: [MailUserService],
  exports: [MailUserService],
})
export class MailUserModule {}
