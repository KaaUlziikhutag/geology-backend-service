import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Indicator from './indicator.entity';
import { IndicatorService } from './indicator.service';
import { IndicatorController } from './indicator.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Indicator])],
  providers: [IndicatorService],
  controllers: [IndicatorController],
})
export class IndicatorModule {}
