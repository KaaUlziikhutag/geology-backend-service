import { Module } from '@nestjs/common';
import { EmploymentContractService } from './employment.service';
import { EmploymentContractController } from './employment.contoller';
import EmploymentContract from './employment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([EmploymentContract]), ConfigModule],
  controllers: [EmploymentContractController],
  providers: [EmploymentContractService],
  exports: [EmploymentContractService],
})
export class EmploymentContractModule {}
