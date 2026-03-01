import { Module } from '@nestjs/common';
import { ContactService } from './contacts.service';
import { ContactController } from './contacts.contoller';
import Contacts from './contacts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Contacts]), ConfigModule],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
