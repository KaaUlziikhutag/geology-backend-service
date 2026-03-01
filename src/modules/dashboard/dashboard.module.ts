import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Customer from '../customer/customer.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import Mineral from '../appointment/mineral/mineral.entity';
import Appointment from '../appointment/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Mineral, Appointment])],
  providers: [DashboardService],
  exports: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
