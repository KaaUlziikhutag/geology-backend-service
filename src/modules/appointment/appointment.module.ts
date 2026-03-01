import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Appointment from './appointment.entity';
import { MineralModule } from './mineral/mineral.module';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), MineralModule],
  providers: [AppointmentService],
  controllers: [AppointmentController],
  exports: [AppointmentService],
})
export class AppointmentModule {}
