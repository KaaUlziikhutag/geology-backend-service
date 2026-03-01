import { Module } from '@nestjs/common';
import { MineralService } from './mineral.service';
import { MineralController } from './mineral.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Mineral from './mineral.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mineral])],
  providers: [MineralService],
  controllers: [MineralController],
  exports: [MineralService],
})
export class MineralModule {}
