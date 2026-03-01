import { Module } from '@nestjs/common';
import { VacationService } from './vacation.service';
import { VacationController } from './vacation.contoller';
import Vacations from './vacation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Vacations]), ConfigModule],
  controllers: [VacationController],
  providers: [VacationService],
  exports: [VacationService],
})
export class VacationModule {}
