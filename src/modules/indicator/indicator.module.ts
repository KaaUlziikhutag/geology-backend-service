import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Indicator from './indicator.entity.js';
import { IndicatorService } from './indicator.service.js';
import { IndicatorController } from './indicator.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Indicator])],
  providers: [IndicatorService],
  controllers: [IndicatorController],
})
export class IndicatorModule {}
