import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Laboratory from './laboratory.entity.js';
import { LaboratoryService } from './laboratory.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Laboratory])],
  providers: [LaboratoryService],
  exports: [LaboratoryService],
})
export class LaboratoryModule {}
