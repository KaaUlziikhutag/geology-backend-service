import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Laboratory from './laboratory.entity';
import { LaboratoryService } from './laboratory.service';

@Module({
  imports: [TypeOrmModule.forFeature([Laboratory])],
  providers: [LaboratoryService],
  exports: [LaboratoryService],
})
export class LaboratoryModule {}
