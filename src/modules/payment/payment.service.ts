import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Payment from './payment.entity';
import { Equal, FindManyOptions, ILike, Repository } from 'typeorm';
import CreatePaymentDto from './dto/create-payment.dto';
import { EbarimtService } from './ebarimt/ebarimt.service';
import { OrderService } from '../order/order.service';
import GetUserDto from '../users/dto/get-user.dto';
import { CompanyService } from '../company/company.service';
import PaymentNotFoundException from './exceptions/payment-not-found.exception';
import Order from '../order/order.entity';
import { ReceiptDto } from './ebarimt/dto/receipt.dto';
import PaymentBadRequestException from './exceptions/payment-bad-request.exception';
import PagePaymentDto from './dto/page-payment.dto';
import PageMetaDto from '../../utils/dto/page-meta.dto';
import PageDto from '../../utils/dto/page.dto';
import {
  CustomerType,
  EbarimtTaxType,
  ReceiptStatus,
  SpendType,
} from '../../utils/enum-utils';
import UpdatePaymentDto from './dto/update-payment.dto';
import GetPaymentDto from './dto/get-payment.dto';
import EbarimtPaymentDto from './dto/ebarimt-payment.dto';
import { CustomerService } from '../customer/customer.service';
import { DiscountService } from '../reference/discount/discount.service';
import { ContractService } from '../contract/contract.service';
import { AdditionService } from '../reference/addition/addition.service';
import { formatFullDate } from '../../utils/helper-utils';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
    private readonly ebarimtService: EbarimtService,
    private readonly orderService: OrderService,
    private readonly companyService: CompanyService,
    private readonly customerService: CustomerService,
    private readonly discountService: DiscountService,
    private readonly contractService: ContractService,
    private readonly additionService: AdditionService,
  ) {}

  async createPayment(payment: CreatePaymentDto): Promise<Payment> {
    const customer = await this.customerService.getCustomerById(
      payment.customerId,
    );
    const orders = await this.orderService.getOrderByIds(payment.orderIds);
    const newPayment = this.paymentRepository.create({
      customerId: payment.customerId,
      type:
        customer.type == CustomerType.individual
          ? EbarimtTaxType.B2C_RECEIPT
          : EbarimtTaxType.B2B_RECEIPT,
      totalAmount: orders.reduce(
        (total, item) => Math.floor(item.totalAmount) + total,
        0,
      ),
      orders,
    });
    return await newPayment.save();
  }

  async updatePayment(id: number, payment: UpdatePaymentDto): Promise<Payment> {
    const updatePayment = await this.getPaymentById(id);
    const customer = await this.customerService.getCustomerById(
      payment.customerId,
    );
    const orders = payment.orderIds
      ? await this.orderService.getOrderByIds(payment.orderIds)
      : await this.orderService.getOrderByIds(
          updatePayment.orders.map((item) => item.id),
        );
    if (payment.customerId) {
      updatePayment.customerId = payment.customerId;
      updatePayment.customer = customer;
    }
    if (orders.length > 0) {
      updatePayment.orders = orders;
    }
    updatePayment.discountId = null;
    updatePayment.discount = null;
    updatePayment.contractId = null;
    updatePayment.contract = null;
    for (const order of orders) {
      order.discountAmount = 0;
      order.paidAmount = order.quantity * Math.floor(order.price.amount);
      order.totalAmount = order.quantity * Math.floor(order.price.amount);
    }
    if (payment.additionId) {
      const addition = await this.additionService.getAdditionById(
        payment.additionId,
      );
      updatePayment.additionId = payment.additionId;
      updatePayment.addition = addition;
      for (const order of orders) {
        if (addition.type == SpendType.percentage) {
          order.paidAmount +=
            (Math.floor(order.paidAmount) * addition.percentage) / 100;
          order.additionAmount =
            (Math.floor(order.totalAmount) * addition.percentage) / 100;
        } else {
          order.paidAmount += Math.floor(addition.amount);
          order.additionAmount = Math.floor(addition.amount);
        }
      }
      await this.orderService.updateOrders(orders);
    }
    if (payment.contractId && payment.discountId) {
      // const contract = await this.contractService.getContractById(
      //   payment.contractId,
      // );
      const discount = await this.discountService.getDiscountById(
        payment.discountId,
      );
      updatePayment.discountId = payment.discountId;
      updatePayment.contractId = payment.contractId;
      // updatePayment.contract = contract;
      updatePayment.discount = discount;
      for (const order of orders) {
        // if (
        //   contract.products.some((item) => item.id == order.price.product.id)
        // ) {
        //   if (discount.type == SpendType.percentage) {
        //     order.discountAmount =
        //       (Math.floor(order.totalAmount) * discount.percentage) / 100;
        //   } else {
        //     order.discountAmount = Math.floor(discount.amount);
        //   }
        //   order.paidAmount =
        //     Math.floor(order.paidAmount) - order.discountAmount;
        // }
      }
      await this.orderService.updateOrders(orders);
    }
    updatePayment.totalAmount = orders.reduce(
      (total, item) => Math.floor(item.totalAmount) + total,
      0,
    );
    updatePayment.paidAmount = orders.reduce(
      (total, item) => Math.floor(item.paidAmount) + total,
      0,
    );
    updatePayment.additionAmount = orders.reduce(
      (total, item) => Math.floor(item.additionAmount) + total,
      0,
    );
    updatePayment.discountAmount = orders.reduce(
      (total, item) => Math.floor(item.discountAmount) + total,
      0,
    );
    return await this.paymentRepository.save(updatePayment);
  }
  async getPaymentById(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: [
        'customer',
        'orders',
        'discount',
        'contract',
        'addition',
        'orders.price',
        'orders.price.product',
        'orders.price.product.classification',
        'details',
      ],
    });
    if (payment) {
      return payment;
    }
    throw new PaymentNotFoundException(id);
  }

  async ebarimtPayment(
    user: IUser,
    id: number,
    ebarimtPayment: EbarimtPaymentDto,
  ): Promise<Payment> {
    // const company = await this.companyService.getCompanyById(user.companyId);
    const payment = await this.getPaymentById(id);
    if (payment.details.length == 0) {
      throw new PaymentBadRequestException('Төлбөр төлөлт хийгдээгүй');
    }
    if (payment.status !== ReceiptStatus.PAID) {
      throw new PaymentBadRequestException('Төлбөр дутуу хийгдсэн байна.');
    }
    payment.type = ebarimtPayment.type;
    // Дэд төлбөрийн баримт taxType бүлэглэх
    const groupByTaxType = (orders: Order[]): ReceiptDto[] => {
      const groupedResult: { [key: string]: ReceiptDto } = {};
      orders.forEach((item) => {
        const { taxType, name, classification } = item.price.product;
        const { paidAmount, quantity, unitPrice, discountAmount } = item;
        // if this taxtType бүлэглэсэн үр дүнд байхгүй бол оруулна
        if (!groupedResult[taxType]) {
          groupedResult[taxType] = {
            totalAmount: 0,
            totalVAT: 0,
            totalCityTax: 0,
            taxType: taxType,
            merchantTin: '' + `company.ebarimtTin`,
            bankAccountNo: '',
            items: [],
          };
        }
        groupedResult[taxType].totalAmount += Math.floor(paidAmount);
        groupedResult[taxType].totalVAT += Math.floor(paidAmount) / 11;
        groupedResult[taxType].items.push({
          name: name,
          barCode: '',
          barCodeType: 'UNDEFINED',
          classificationCode: classification.code,
          taxProductCode: '',
          qty: quantity,
          totalAmount: paidAmount,
          measureUnit: 'ш',
          unitPrice: Math.floor(unitPrice) - Math.floor(discountAmount),
          totalVAT: paidAmount / 11,
          totalCityTax: 0,
        });
      });
      return Object.values(groupedResult);
    };
    const res = await this.ebarimtService.createReceipt({
      totalAmount: payment.paidAmount,
      totalVAT: payment.paidAmount / 11,
      totalCityTax: 0,
      districtCode: '', // company.district.code,
      merchantTin: '', // company.ebarimtTin,
      branchNo: '001',
      customerTin:
        payment.type == EbarimtTaxType.B2B_RECEIPT
          ? payment.customer.ebarimtTin
          : null,
      consumerNo:
        payment.type == EbarimtTaxType.B2C_RECEIPT
          ? payment.customer.ebarimtNo
          : null,
      type: payment.type,
      inactiveId: '',
      invoiceId: '',
      receipts: groupByTaxType(payment.orders),
      payments: payment.details,
    });
    if (res.status == 'SUCCESS') {
      payment.invoiceId = res.id;
      payment.lottery = res.lottery;
      payment.qrData = res.qrData;
      payment.status = ReceiptStatus.SUCCESS;
      return await this.paymentRepository.save(payment);
    }
  }

  async chargePayment(id: number): Promise<Payment> {
    const payment = await this.getPaymentById(id);
    const paidAmount = payment.details.reduce(
      (total, item) => total + Math.floor(item.paidAmount),
      0,
    );
    if (payment.totalAmount <= paidAmount) {
      payment.status = ReceiptStatus.PAID;
      return await this.paymentRepository.save(payment);
    }
    return payment;
  }
  async getPagePayment(query: PagePaymentDto) {
    const { page = 1, skip, limit = 10, order } = query;
    const where: FindManyOptions<Payment>['where'] = {};
    if (query.search) {
      where.customer = [
        { regno: ILike(`%${query.search}%`) },
        { name: ILike(`%${query.search}%`) },
        { addName: ILike(`%${query.search}%`) },
        { email: ILike(`%${query.search}%`) },
        { phone: ILike(`%${query.search}%`) },
        { addPhone: ILike(`%${query.search}%`) },
        { address: ILike(`%${query.search}%`) },
      ];
    }
    const [items, itemCount] = await this.paymentRepository.findAndCount({
      where,
      relations: ['customer', 'details'],
      skip,
      take: limit,
      order: { createdAt: order },
    });
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }
  async getAllPayment(query: GetPaymentDto): Promise<Payment[]> {
    const where: FindManyOptions<Payment>['where'] = {};
    if (query.customerId) {
      where.customerId = Equal(query.customerId);
    }
    return await this.paymentRepository.find({ where });
  }
  async cancelPayment(id: number): Promise<Payment> {
    const payment = await this.getPaymentById(id);
    payment.status = ReceiptStatus.CANCELLED;
    if (payment.invoiceId) {
      await this.ebarimtService.deleteReceipt({
        id: payment.invoiceId,
        date: formatFullDate(payment.createdAt),
      });
    }
    return await this.paymentRepository.save(payment);
  }
}
