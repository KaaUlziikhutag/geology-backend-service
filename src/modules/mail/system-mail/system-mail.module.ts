import { Module } from '@nestjs/common';
import { SystemMailService } from './system-mail.service';
import { SystemMailController } from './system-mail.contoller';
import SystemMail from './system-mail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([SystemMail]), ConfigModule],
  controllers: [SystemMailController],
  providers: [SystemMailService],
  exports: [SystemMailService],
})
export class SystemMailModule {}
