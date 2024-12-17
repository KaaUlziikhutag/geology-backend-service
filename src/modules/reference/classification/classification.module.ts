import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Classification from './classification.entity.js';
import { ClassificationService } from './classification.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Classification])],
  providers: [ClassificationService],
  exports: [ClassificationService],
})
export class ClassificationModule {}
