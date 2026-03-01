import { Module } from '@nestjs/common';
import { AppointmentModule } from '../appointment/appointment.module';
import { MineralModule } from '../appointment/mineral/mineral.module';
import { IndicatorModule } from '../indicator/indicator.module';
import { TestingResultModule } from '../testing-results/testing-result.module';
import { ReportModule } from '../report/report.module';

@Module({
  imports: [AppointmentModule, MineralModule, IndicatorModule, TestingResultModule, ReportModule],
})
export class LaboratoryModule {}
