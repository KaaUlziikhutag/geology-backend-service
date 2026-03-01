import { Module } from '@nestjs/common';
import { AppointmentModule } from '../appointment/appointment.module';
import { ReportController } from './report.controller';
import { CompanyModule } from '../company/company.module';
import { OrderModule } from '../order/order.module';
import { EbarimtModule } from '../payment/ebarimt/ebarimt.module';
import { ReportService } from './report.service';
import { ElementModule } from '../reference/element/element.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import SectionProduct from '../reference/section-product/section-product.entity';
import SectionCustomer from '../reference/section-customer/section-customer.entity';
import Customer from '../customer/customer.entity';

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
