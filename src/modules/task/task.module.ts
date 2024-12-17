import { TypeOrmModule } from '@nestjs/typeorm';
import Task from './task.entity.js';
import { Module } from '@nestjs/common';
import { TaskService } from './task.service.js';
import { TaskController } from './task.controller.js';
import { MineralModule } from '../appointment/mineral/mineral.module.js';
import { BarcodeModule } from '../barcode/barcode.module.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    MineralModule,
    BarcodeModule,
    UsersModule,
  ],
  providers: [TaskService],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}
