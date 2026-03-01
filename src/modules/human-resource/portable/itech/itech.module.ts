import { Module } from '@nestjs/common';
import { ItechService } from './itech.service';
import { ItechController } from './itech.contoller';
import Itechs from './itech.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Itechs]), ConfigModule],
  controllers: [ItechController],
  providers: [ItechService],
  exports: [ItechService],
})
export class ItechModule {}
