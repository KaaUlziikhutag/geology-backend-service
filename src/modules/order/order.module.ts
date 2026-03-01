import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Order from './order.entity';
import { OrderService } from './order.service';
import { MineralModule } from '../appointment/mineral/mineral.module';
import { OrderController } from './order.controller';
import { ContractModule } from '../contract/contract.module';
import { AppointmentModule } from '../appointment/appointment.module';
import { PriceModule } from '../price/price.module';
import { UsersModule } from '../users/users.module';
import { NotificationModule } from '../notification/notification.module';
import { TaskModule } from '../task/task.module';

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
