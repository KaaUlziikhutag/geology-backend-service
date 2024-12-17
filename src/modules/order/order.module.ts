import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Order from './order.entity.js';
import { OrderService } from './order.service.js';
import { MineralModule } from '../appointment/mineral/mineral.module.js';
import { OrderController } from './order.controller.js';
import { ContractModule } from '../contract/contract.module.js';
import { AppointmentModule } from '../appointment/appointment.module.js';
import { PriceModule } from '../price/price.module.js';
import { UsersModule } from '../users/users.module.js';
import { NotificationModule } from '../notification/notification.module.js';
import { TaskModule } from '../task/task.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    MineralModule,
    ContractModule,
    AppointmentModule,
    PriceModule,
    NotificationModule,
    UsersModule,
    TaskModule,
  ],
  providers: [OrderService],
  exports: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
