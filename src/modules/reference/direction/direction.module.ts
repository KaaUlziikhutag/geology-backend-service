import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Direction } from './direction.entity.js';
import { DirectionService } from './direction.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Direction])],
  providers: [DirectionService],
  exports: [DirectionService],
})
export class DirectionModule {}
