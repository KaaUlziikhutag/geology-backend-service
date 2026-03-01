import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import MineralType from './mineral-type.entity';
import { MineralTypeService } from './mineral-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([MineralType])],
  providers: [MineralTypeService],
  exports: [MineralTypeService],
})
export class MineralTypeModule {}
