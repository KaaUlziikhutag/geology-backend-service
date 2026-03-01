import { Module } from '@nestjs/common';
import { ContractService } from './contracts.service';
import { ContractController } from './contracts.contoller';
import Contracts from './contracts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Contracts]), ConfigModule],
  controllers: [ContractController],
  providers: [ContractService],
  exports: [ContractService],
})
export class WorkerContractModule {}
