import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SectionCustomer from './section-customer.entity';
import { SectionCustomerService } from './section-customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([SectionCustomer])],
  providers: [SectionCustomerService],
  exports: [SectionCustomerService],
})
export class SectionCustomerModule {}
