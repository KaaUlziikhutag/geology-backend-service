import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Customer from '../customer/customer.entity';
import { Equal, FindManyOptions, Repository } from 'typeorm';
import { GetCustomerDto } from './dto/get-dashboard.dto';
import { CustomerType } from '../../utils/enum-utils';
import Mineral from '../appointment/mineral/mineral.entity';
import Appointment from '../appointment/appointment.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,

    @InjectRepository(Mineral)
    private mineralRepository: Repository<Mineral>,

    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async getCountCustomer(query: GetCustomerDto): Promise<number> {
    const where: FindManyOptions<Customer>['where'] = {};
    if (query.type) {
      where.type = Equal(query.type);
    }
    return await this.customerRepository.countBy(where);
  }

  async getCountMineral(): Promise<number> {
    return await this.mineralRepository.count();
  }

  async getCountAppointment(): Promise<number> {
    return await this.appointmentRepository.count();
  }
  async getDashboard() {
    const totalCustomer = await this.getCountCustomer({ type: undefined });
    // const totalMineral = await this.getCountMineral({});
    const confirmCustomer = await this.getCountCustomer({ type: undefined });
    const individualCustomer = await this.getCountCustomer({
      type: CustomerType.individual,
    });
    const organizationCustomer = await this.getCountCustomer({
      type: CustomerType.organization,
    });
    return {
      totalCustomer,
      totalMineral: 0,
      confirmCustomer,
      individualCustomer,
      organizationCustomer,
    };
  }
}
