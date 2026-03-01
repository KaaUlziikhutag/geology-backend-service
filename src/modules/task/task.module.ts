import { TypeOrmModule } from '@nestjs/typeorm';
import Task from './task.entity';
import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { MineralModule } from '../appointment/mineral/mineral.module';
import { BarcodeModule } from '../barcode/barcode.module';
import { UsersModule } from '../users/users.module';

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
