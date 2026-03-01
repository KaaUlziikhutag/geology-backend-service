import { Module } from '@nestjs/common';
import { DisabledService } from './disabled.service';
import { DisabledController } from './disabled.contoller';
import Disableds from './disabled.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Disableds]), ConfigModule],
  controllers: [DisabledController],
  providers: [DisabledService],
  exports: [DisabledService],
})
export class DisabledModule {}
