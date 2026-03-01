import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Classification from './classification.entity';
import { ClassificationService } from './classification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Classification])],
  providers: [ClassificationService],
  exports: [ClassificationService],
})
export class ClassificationModule {}
