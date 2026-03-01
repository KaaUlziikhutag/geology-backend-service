import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Measurement from './measurement.entity';
import { MeasurementService } from './measurement.service';

@Module({
  imports: [TypeOrmModule.forFeature([Measurement])],
  providers: [MeasurementService],
  exports: [MeasurementService],
})
export class MeasurementModule {}
