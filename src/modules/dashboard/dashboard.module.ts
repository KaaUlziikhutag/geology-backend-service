import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Customer from '../customer/customer.entity.js';
import { DashboardService } from './dashboard.service.js';
import { DashboardController } from './dashboard.controller.js';
import Mineral from '../appointment/mineral/mineral.entity.js';
import Appointment from '../appointment/appointment.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Mineral, Appointment])],
  providers: [DashboardService],
  exports: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
