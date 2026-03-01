import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { SignatureController } from './mail.contoller';
import Mail from './mail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Mail]), ConfigModule],
  controllers: [SignatureController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
