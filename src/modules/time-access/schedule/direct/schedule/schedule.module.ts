import { Module } from '@nestjs/common';
import { DirectScheduleService } from './schedule.service';
import { DirectScheduleController } from './schedule.contoller';
import DirectSchedules from './schedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([DirectSchedules]), ConfigModule],
  controllers: [DirectScheduleController],
  providers: [DirectScheduleService],
  exports: [DirectScheduleService],
})
export class DirectScheduleModule {}
