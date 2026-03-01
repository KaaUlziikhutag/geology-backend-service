import { Module } from '@nestjs/common';
import { TimeStateService } from './time-state.service';
import { TimeStateController } from './time-state.contoller';
import TimeStates from './time-state.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([TimeStates]), ConfigModule],
  controllers: [TimeStateController],
  providers: [TimeStateService],
  exports: [TimeStateService],
})
export class TimeStateModule {}
