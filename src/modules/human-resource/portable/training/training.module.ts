import { Module } from '@nestjs/common';
import { TrainingService } from './training.service';
import { TrainingController } from './training.contoller';
import Trainings from './training.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Trainings]), ConfigModule],
  controllers: [TrainingController],
  providers: [TrainingService],
  exports: [TrainingService],
})
export class TrainingModule {}
