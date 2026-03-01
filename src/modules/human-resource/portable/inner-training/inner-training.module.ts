import { Module } from '@nestjs/common';
import { InnerTrainingService } from './inner-training.service';
import { InnerTrainingController } from './inner-training.contoller';
import InnerTrainings from './inner-training.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([InnerTrainings]), ConfigModule],
  controllers: [InnerTrainingController],
  providers: [InnerTrainingService],
  exports: [InnerTrainingService],
})
export class InnerTrainingModule {}
