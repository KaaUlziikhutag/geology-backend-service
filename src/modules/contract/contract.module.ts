import { Module } from '@nestjs/common';
import Contract from './contract.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { DiscountModule } from '../reference/discount/discount.module';
import { ConfigModule } from '@nestjs/config';
import { DelegateOurModule } from './delegate-our/delegate-our.module';
import { DelegateOutModule } from './delegate-out/delegate-out.module';
import { EmploymentContractModule } from './option/employment/employment.module';
import { ContractTypeModule } from './option/type/type.module';
import { ViewUsersModule } from './view-users/view-users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contract]),
    ConfigModule,
    DiscountModule,
    DelegateOurModule,
    DelegateOutModule,
    EmploymentContractModule,
    ContractTypeModule,
    ViewUsersModule,
  ],
  providers: [ContractService],
  exports: [ContractService],
  controllers: [ContractController],
})
export class ContractModule {}
