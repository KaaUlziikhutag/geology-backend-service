import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractController } from './contract.contoller';
import Contract from './contract.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Contract]), ConfigModule],
  controllers: [ContractController],
  providers: [ContractService],
  exports: [ContractService],
})
export class ContractModule {}
