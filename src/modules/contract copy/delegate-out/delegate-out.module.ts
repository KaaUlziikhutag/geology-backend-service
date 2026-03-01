import { Module } from '@nestjs/common';
import { DelegateOutService } from './delegate_out.service';
import ContractDelegateOut from './delegate-out.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([ContractDelegateOut]), ConfigModule],
  providers: [DelegateOutService],
  exports: [DelegateOutService],
})
export class ContractModule {}
