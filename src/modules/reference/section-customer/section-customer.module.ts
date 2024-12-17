import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SectionCustomer from './section-customer.entity.js';
import { SectionCustomerService } from './section-customer.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([SectionCustomer])],
  providers: [SectionCustomerService],
  exports: [SectionCustomerService],
})
export class SectionCustomerModule {}
