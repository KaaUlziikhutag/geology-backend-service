import { Module } from '@nestjs/common';
import { MainScheduleService } from './main-schedule.service';
import { MainScheduleController } from './main-schedule.contoller';
import MainSchedules from './main-schedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([MainSchedules]), ConfigModule],
  controllers: [MainScheduleController],
  providers: [MainScheduleService],
  exports: [MainScheduleService],
})
export class MainScheduleModule {}
