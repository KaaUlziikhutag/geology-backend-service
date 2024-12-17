import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Appointment from './appointment.entity.js';
import { MineralModule } from './mineral/mineral.module.js';
import { AppointmentService } from './appointment.service.js';
import { AppointmentController } from './appointment.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), MineralModule],
  providers: [AppointmentService],
  controllers: [AppointmentController],
  exports: [AppointmentService],
})
export class AppointmentModule {}
