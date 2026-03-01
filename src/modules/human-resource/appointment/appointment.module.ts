import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.contoller';
import Appointments from './entities/appointment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { FieldModule } from '../../cloud/field/field.module';
import { ColumnService } from '../column-setup/column.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointments]),
    ConfigModule,
    FieldModule,
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService, ColumnService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
