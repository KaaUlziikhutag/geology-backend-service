import { Module } from '@nestjs/common';
import { InsuranceTypeService } from './insurance-type.service';
import { InsuranceTypeController } from './insurance-type.contoller';
import InsuranceTypes from './insurance-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([InsuranceTypes]), ConfigModule],
  controllers: [InsuranceTypeController],
  providers: [InsuranceTypeService],
  exports: [InsuranceTypeService],
})
export class InsuranceTypeModule {}
