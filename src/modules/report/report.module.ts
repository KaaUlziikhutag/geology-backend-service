import { Module } from '@nestjs/common';
import { AppointmentModule } from '../appointment/appointment.module.js';
import { ReportController } from './report.controller.js';
import { CompanyModule } from '../company/company.module.js';
import { OrderModule } from '../order/order.module.js';
import { EbarimtModule } from '../payment/ebarimt/ebarimt.module.js';
import { ReportService } from './report.service.js';
import { ElementModule } from '../reference/element/element.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import SectionProduct from '../reference/section-product/section-product.entity.js';
import SectionCustomer from '../reference/section-customer/section-customer.entity.js';
import Customer from '../customer/customer.entity.js';

@Module({
  imports: [
    AppointmentModule,
    CompanyModule,
    OrderModule,
    EbarimtModule,
    TypeOrmModule.forFeature([SectionProduct, SectionCustomer, Customer]),
  ],
  providers: [ReportService],
  exports: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}
