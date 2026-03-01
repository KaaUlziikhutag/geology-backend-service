import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { GetCustomerDto } from './dto/get-customer.dto';
import { EntityManager, FindManyOptions, ILike } from 'typeorm';
import Customer from './customer.entity';
import { PageDto } from '../../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../cloud/user/dto/get-user.dto';
import CustomerNotFoundException from './exceptions/customer-not-found.exception';

@Injectable()
export class CustomerService {
  /**
   * @ignore
   */
  constructor(private moduleRef: ModuleRef) {}

  private async loadEntityManager(systemId: string): Promise<EntityManager> {
    return this.moduleRef.get(getEntityManagerToken(`ioffice_${systemId}`), {
      strict: false,
    });
  }

  /**
   * A method that fetches the Category from the database
   * @returns A promise with the list of Category
   */
  async getAllCustomers(query: GetCustomerDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Customer>['where'] = {};
    if (query.name) {
      where.name = ILike('%' + query.name + '%');
    }
    if (query.web) {
      where.web = ILike('%' + query.web + '%');
    }
    if (query.phone) {
      where.phone = ILike('%' + query.phone + '%');
    }
    const page =
      query.page && !isNaN(query.page) && query.page > 0
        ? Number(query.page)
        : 1;
    const limit =
      query.limit && !isNaN(query.limit) && query.limit > 0
        ? Number(query.limit)
        : 10;
    const skip = (page - 1) * limit;
    const [items, count] = await entityManager.findAndCount(Customer, {
      where,
      order: {
        createdAt: 'DESC',
      },
      skip: skip,
      take: limit,
    });
    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a Category with a given id. Example:
   *
   * @example
   * const Category = await categoryService.getCategoryById(1);
   */
  async getCustomerById(
    customerId: number,
    user: GetUserDto,
  ): Promise<Customer> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const customer = await entityManager.findOne(Customer, {
      where: { id: customerId },
    });
    if (customer) {
      return customer;
    }
    throw new CustomerNotFoundException(customerId);
  }

  /**
   *
   * @param Category createCategory
   *
   */
  async createCustomer(customer: CreateCustomerDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newCustomer = entityManager.create(Customer, customer);
    await entityManager.save(newCustomer);
    return newCustomer;
  }

  /**
   * See the [definition of the UpdateCategoryDto file]{@link UpdateCategoryDto} to see a list of required properties
   */
  async updateCustomer(
    id: number,
    user: GetUserDto,
    customer: UpdateCustomerDto,
  ): Promise<Customer> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Customer, id, customer);
    const updatedCustomer = await entityManager.findOne(Customer, {
      where: { id: id },
    });
    if (updatedCustomer) {
      return updatedCustomer;
    }
    throw new CustomerNotFoundException(id);
  }

  /**
   * @deprecated Use deleteCategory instead
   */
  async deleteCustomerById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteCustomer(id, user);
  }

  /**
   * A method that deletes a category from the database
   * @param id An id of a category. A category with this id should exist in the database
   */
  async deleteCustomer(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(Customer, id);
    if (!deleteResponse.affected) {
      throw new CustomerNotFoundException(id);
    }
  }
}
