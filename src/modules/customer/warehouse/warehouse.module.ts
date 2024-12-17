import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Warehouse from './warehouse.entity.js';
import { WarehouseService } from './warehouse.service.js';
import { WarehouseController } from './warehouse.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse])],
  providers: [WarehouseService],
  controllers: [WarehouseController],
})
export class WarehouseModule {}
