import { Module } from '@nestjs/common';
import { MineralService } from './mineral.service.js';
import { MineralController } from './mineral.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import Mineral from './mineral.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Mineral])],
  providers: [MineralService],
  controllers: [MineralController],
  exports: [MineralService],
})
export class MineralModule {}

