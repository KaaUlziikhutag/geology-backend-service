import { Injectable } from '@nestjs/common';
import { join } from 'path';
import * as ejs from 'ejs';
import {
  formatDate,
  formatMonth,
  formatYearMonth,
  generatePdf,
  getMonthDates,
  getYearDates,
  imageToBase64,
} from '../../utils/helper-utils';
import { AppointmentService } from '../appointment/appointment.service';
import { CompanyService } from '../company/company.service';
import IInvoice from './interface/invoice.interface';
import { OrderService } from '../order/order.service';
import { InvoiceDto } from './dto/invoice.dto';
import { EbarimtService } from '../payment/ebarimt/ebarimt.service';
import GetUserDto from '../users/dto/get-user.dto';
import { ElementService } from '../reference/element/element.service';
import { InjectRepository } from '@nestjs/typeorm';
import SectionProduct from '../reference/section-product/section-product.entity';
import { Repository } from 'typeorm';
import { GetSectionDto } from './dto/get-section.dto';
import SectionCustomer from '../reference/section-customer/section-customer.entity';
import { ReceiptStatus } from '../../utils/enum-utils';
import Customer from '../customer/customer.entity';
import ISectionCustomer from './interface/section-customer.interface';
import IUser from '@modules/users/interface/user.interface';

@Injectable()
export class ReportService {
  private readonly templatePath = join(process.cwd() + '/src/templates/');
  private readonly logo = join(process.cwd() + '/public/images/logo.png');
  constructor(
    @InjectRepository(SectionProduct)
    private readonly sectionProductRepository: Repository<SectionProduct>,
    @InjectRepository(SectionCustomer)
    private readonly sectionCustomerRepository: Repository<SectionCustomer>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly companyService: CompanyService,
    private readonly appointmentService: AppointmentService,
    private readonly orderService: OrderService,
    private readonly ebarimtService: EbarimtService,
  ) {}

  async reportAppointment(id: number): Promise<string> {
    const appointment = await this.appointmentService.getAppointmentById(id);
    return await ejs.renderFile(this.templatePath + 'appointment.ejs', {
      ...appointment,
      logo: imageToBase64(this.logo),
      createdAt: formatDate(appointment.createdAt),
    });
  }
  /** Үйлчлүүлэгчийн нэхэмжлэл */
  async reportInvoice(user: IUser, invoice: InvoiceDto): Promise<string> {
    const company = await this.companyService.getCompanyById(1);
    const appointment = await this.appointmentService.getAppointmentById(
      invoice.appointmentId,
    );
    const bankAccounts = await this.ebarimtService.bankAccounts(
      company.ebarimtTin,
    );
    const orders = await this.orderService.getOrderByIds(invoice.orderIds);
    const payload: IInvoice = {
      logo: imageToBase64(this.logo),
      code: appointment.code,
      date: formatDate(new Date()),
      dueDate: formatDate(new Date()),
      clientName: appointment.customer.name,
      clientAddress: appointment.customer.address,
      companyName: company.name,
      companyAddress: company.address,
      companyRegno: company.regno,
      companyPhone: company.phone,
      companyEmail: company.email,
      total: orders.reduce(
        (total, item) => total + Math.floor(item.totalAmount),
        0,
      ),
      bankAccounts: [bankAccounts[0], bankAccounts[1], bankAccounts[2]],
      // bankAccounts.map((item) => ({
      //   bankName: item.bankName,
      //   bankAccountNo: item.bankAccountNo,
      //   bankAccountName: item.bankAccountName,
      // })),
      items: orders.map((item) => ({
        description: item.price.product.name,
        quantity: item.quantity,
        amount: item.totalAmount,
      })),
    };
    return await ejs.renderFile(this.templatePath + 'invoice.ejs', payload);
  }
  /** Ажлын гүцэтгэлийн тайлан шинжилгээний төрлөөр */
  async reportSectionProduct(query: GetSectionDto) {
    const { startAt: yearFromAt, endAt: yearToAt } = getYearDates(
      query.reportAt,
    );
    const { startAt: monthFromAt, endAt: monthToAt } = getMonthDates(
      query.reportAt,
    );
    const yearFrom = formatDate(yearFromAt);
    const yearTo = formatDate(yearToAt);
    const monthFrom = formatDate(monthFromAt);
    const monthTo = formatDate(monthToAt);
    const qb = this.sectionProductRepository.createQueryBuilder('section');
    qb.select('section.id', 'id');
    qb.addSelect('section.name', 'name');
    qb.addSelect(
      'SUM(CASE WHEN payment.createdAt BETWEEN :yearFrom AND :yearTo THEN order.totalAmount ELSE 0 END)',
      'yearAmount',
    );
    qb.addSelect(
      'SUM(CASE WHEN payment.createdAt BETWEEN :yearFrom AND :yearTo THEN order.quantity ELSE 0 END)',
      'yearQty',
    );
    qb.addSelect(
      'SUM(CASE WHEN payment.createdAt BETWEEN :monthFrom AND :monthTo THEN order.totalAmount ELSE 0 END)',
      'monthAmount',
    );
    qb.addSelect(
      'SUM(CASE WHEN payment.createdAt BETWEEN :monthFrom AND :monthTo THEN order.quantity ELSE 0 END)',
      'monthQty',
    );
    qb.leftJoin('section.products', 'product');
    qb.leftJoin('product.prices', 'price');
    qb.leftJoin('price.orders', 'order');
    qb.leftJoin('order.payment', 'payment');
    qb.where('payment.status = :status');
    qb.groupBy('section.id');
    qb.addGroupBy('section.name');
    qb.setParameters({
      yearFrom,
      yearTo,
      monthFrom,
      monthTo,
      status: ReceiptStatus.SUCCESS,
    });
    const sections = await qb.getRawMany();
    return await ejs.renderFile(this.templatePath + 'section-product.ejs', {
      reportYearMonth: formatYearMonth(query.reportAt),
      reportMonth: formatMonth(query.reportAt),
      sections,
      yearAmount: sections
        .reduce((total, item) => total + Math.floor(item?.yearAmount), 0)
        .toFixed(2),
      yearQty: sections.reduce(
        (total, item) => total + Math.floor(item?.yearQty),
        0,
      ),
      monthAmount: sections
        .reduce((total, item) => total + Math.floor(item?.monthAmount), 0)
        .toFixed(2),
      monthQty: sections.reduce(
        (total, item) => total + Math.floor(item?.monthQty),
        0,
      ),
    });
  }
  /** Ажлын нэгдсэн гүйцэтгэл харилцагчийн бүлэгээр */
  async reportSectionCustomer(query: GetSectionDto) {
    const { startAt: yearFromAt, endAt: yearToAt } = getYearDates(
      query.reportAt,
    );
    const { startAt: monthFromAt, endAt: monthToAt } = getMonthDates(
      query.reportAt,
    );
    const yearFrom = formatDate(yearFromAt);
    const yearTo = formatDate(yearToAt);
    const monthFrom = formatDate(monthFromAt);
    const monthTo = formatDate(monthToAt);
    const qb = this.sectionCustomerRepository
      .createQueryBuilder('section')
      .select('section.id', 'sectionId')
      .addSelect('section.code', 'sectionCode')
      .addSelect('section.name', 'sectionName')
      .addSelect('customer.id', 'customerId')
      .addSelect('customer.name', 'customerName')
      .addSelect(
        'SUM(CASE WHEN payment.createdAt BETWEEN :yearFrom AND :yearTo THEN order.totalAmount ELSE 0 END)',
        'yearAmount',
      )
      .addSelect(
        'SUM(CASE WHEN payment.createdAt BETWEEN :yearFrom AND :yearTo THEN order.quantity ELSE 0 END)',
        'yearQty',
      )
      .addSelect(
        'SUM(CASE WHEN payment.createdAt BETWEEN :monthFrom AND :monthTo THEN order.totalAmount ELSE 0 END)',
        'monthAmount',
      )
      .addSelect(
        'SUM(CASE WHEN payment.createdAt BETWEEN :monthFrom AND :monthTo THEN order.quantity ELSE 0 END)',
        'monthQty',
      )
      .leftJoin('section.customers', 'customer')
      .leftJoin('customer.payments', 'payment')
      .leftJoin('payment.orders', 'order')
      .where('payment.status = :status')
      .setParameters({
        yearFrom,
        yearTo,
        monthFrom,
        monthTo,
        status: ReceiptStatus.SUCCESS,
      })
      .groupBy('section.id')
      .addGroupBy('customer.id')
      .orderBy('section.id', 'ASC')
      .addOrderBy('customer.id', 'ASC');

    const rawResults = await qb.getRawMany();
    const reportSections: ISectionCustomer[] = [];
    const sectionsMap = new Map<number, ISectionCustomer>();
    rawResults.forEach((row) => {
      const sectionId = row.sectionId;
      const customerData = {
        id: row.customerId,
        name: row.customerName,
        monthQty: parseInt(row.monthQty, 10) || 0,
        monthAmount: parseFloat(row.monthAmount) || 0,
        yearQty: parseInt(row.yearQty, 10) || 0,
        yearAmount: parseFloat(row.yearAmount) || 0,
      };

      if (!sectionsMap.has(sectionId)) {
        const newSection: ISectionCustomer = {
          id: sectionId,
          code: row.sectionCode,
          name: row.sectionName,
          customers: [],
          monthQty: 0,
          monthAmount: 0,
          yearQty: 0,
          yearAmount: 0,
        };
        sectionsMap.set(sectionId, newSection);
        reportSections.push(newSection);
      }
      const section = sectionsMap.get(sectionId);
      // Add customer data to the section
      section.customers.push(customerData);
      section.monthQty += customerData.monthQty;
      section.monthAmount += customerData.monthAmount;
      section.yearQty += customerData.yearQty;
      section.yearAmount += customerData.yearAmount;
    });
    // return reportSections;
    return await ejs.renderFile(
      this.templatePath + 'section-customer.ejs',
      {
        reportYearMonth: formatYearMonth(query.reportAt),
        sections: reportSections,
      },
      { async: true },
    );
  }

  async pdfAppointment(id: number): Promise<Uint8Array> {
    const content = await this.reportAppointment(id);
    return await generatePdf(content);
  }
  async pdfInvoice(user: IUser, invoice: InvoiceDto): Promise<Uint8Array> {
    const content = await this.reportInvoice(user, invoice);
    return await generatePdf(content);
  }
  async pdfJobPerformance(): Promise<Uint8Array> {
    const content = await ejs.renderFile(
      this.templatePath + 'job-performance.ejs',
    );
    return await generatePdf(content);
  }

  // async getMineralReport(user: IUser, ): Promise<string> {

  // }
}
