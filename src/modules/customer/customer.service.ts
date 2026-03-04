import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Customer from './customer.entity';
import { Equal, FindManyOptions, ILike, Repository } from 'typeorm';
import GetCustomerDto from './dto/get-customer.dto';
import PageMetaDto from '../../utils/dto/page-meta.dto';
import PageDto from '../../utils/dto/page.dto';
import { CustomerType } from '../../utils/enum-utils';
import CustomerNotFoundException from './exceptions/customer-not-found.exception';
import CreateCustomerDto from './dto/create-customer.dto';
import UpdateCustomerDto from './dto/update-customer.dto';
import { EbarimtEasyService } from '../payment/ebarimt/ebarimt-easy/ebarimt-easy.service';
import { EbarimtInquireService } from '../payment/ebarimt/ebarimt-inquire/ebarimt-inquire.service';
import GetUserDto from '../users/dto/get-user.dto';
import IUser from '@modules/users/interface/user.interface';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private readonly ebarimtEasyService: EbarimtEasyService,
    private readonly ebarimtInquireService: EbarimtInquireService,
  ) {}

  async createCustomer(
    user: IUser,
    customer: CreateCustomerDto,
  ): Promise<Customer> {
    const { ebarimtNo, ebarimtTin } = await this.ebarimtCustomer(customer);
    const newCustomer = this.customerRepository.create({
      ...customer,
      ebarimtNo,
      ebarimtTin,
      createdBy: user.id,
    });
    await this.customerRepository.save(newCustomer);
    return newCustomer;
  }

  async getAllCustomer(query: GetCustomerDto): Promise<PageDto<Customer>> {
    const { page, skip, limit, order } = query;
    let where: FindManyOptions<Customer>['where'] = {};
    if (query.type) {
      where.type = Equal(query.type);
    }
    if (query.provinceId) {
      where.provinceId = Equal(query.provinceId);
    }
    if (query.districtId) {
      where.districtId = Equal(query.districtId);
    }
    if (query.search) {
      where = [
        { regno: ILike(`%${query.search}%`) },
        { name: ILike(`%${query.search}%`) },
        { addName: ILike(`%${query.search}%`) },
        { email: ILike(`%${query.search}%`) },
        { phone: ILike(`%${query.search}%`) },
        { addPhone: ILike(`%${query.search}%`) },
        { address: ILike(`%${query.search}%`) },
      ];
    }
    const [items, itemCount] = await this.customerRepository.findAndCount({
      where,
      skip,
      take: limit,
      relations: [
        'direction',
        'section',
        'province',
        'district',
        'createdUser',
        'updatedUser',
      ],
      order: { createdAt: order },
    });
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }
  async getCustomerById(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['direction', 'section', 'createdUser', 'updatedUser'],
    });
    if (customer) {
      return customer;
    }
    throw new CustomerNotFoundException(id);
  }
  async getCustomerByRegno(regno: string): Promise<Customer> {
    const customer = await this.customerRepository.findOneBy({ regno });
    if (customer) {
      return customer;
    }
    throw new CustomerNotFoundException(regno);
  }

  async updateCustomer(
    user: IUser,
    id: number,
    customer: UpdateCustomerDto,
  ): Promise<Customer> {
    const { ebarimtNo, ebarimtTin } = await this.ebarimtCustomer(customer);
    await this.customerRepository.update(id, {
      ...customer,
      ebarimtNo,
      ebarimtTin,
      updatedBy: user.id,
    });
    return await this.getCustomerById(id);
  }
  async deleteCustomer(id: number): Promise<void> {
    const deleteResponse = await this.customerRepository.softDelete(id);
    if (!deleteResponse.affected) {
      throw new CustomerNotFoundException(id);
    }
  }
  async ebarimtCustomer(
    customer: CreateCustomerDto | UpdateCustomerDto,
  ): Promise<{ ebarimtNo: string; ebarimtTin: string }> {
    try {
      if (customer.type == CustomerType.individual) {
        const { loginName } = await this.ebarimtEasyService.consumerByRegno(
          customer.regno,
        );
        return { ebarimtNo: loginName ? loginName : null, ebarimtTin: null };
      } else {
        const { data } = await this.ebarimtInquireService.getTinInfo(
          customer.regno,
        );
        return { ebarimtTin: data ? data : null, ebarimtNo: null };
      }
    } catch (error) {
      return { ebarimtNo: null, ebarimtTin: null };
    }
  }
}
