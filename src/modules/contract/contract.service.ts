import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Contract from './contract.entity.js';
import {
  Between,
  Equal,
  FindManyOptions,
  In,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import GetContractDto from './dto/get-contract.dto.js';
import CreateContractDto from './dto/create-contract.dto.js';
import { ProductService } from '../product/product.service.js';
import GetUserDto from '../users/dto/get-user.dto.js';
import UpdateContractDto from './dto/update-contract.dto.js';
import ContractNotFoundException from './exceptions/contract-not-found.exception.js';
import { DiscountService } from '../reference/discount/discount.service.js';
import { GetValidContractDto } from './dto/get-valid-contract.dto.js';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
    private readonly productService: ProductService,
    private readonly discountService: DiscountService,
  ) {}

  async createContract(user: GetUserDto, contract: CreateContractDto) {
    const products = await this.productService.getProducts({
      ids: contract.productIds,
    });
    if (products.length == 0) {
      throw 'Үйлчилгээнүүд буруу байна!';
    }
    const discounts = await this.discountService.getAllDiscount({
      ids: contract.discountIds,
    });
    const newContract = this.contractRepository.create({
      ...contract,
      products,
      discounts,
      createdBy: user.id,
    });
    return await newContract.save();
  }

  async getAllContract(query: GetContractDto) {
    const where: FindManyOptions<Contract>['where'] = {};
    if (query.customerId) {
      where.customerId = Equal(query.customerId);
    }
    if (query.currentAt) {
      const { startAt, endAt } = query.currentAt;
      where.currentAt = Between(startAt, endAt);
    }
    if (query.endAt) {
      const { startAt, endAt } = query.endAt;
      where.endAt = Between(startAt, endAt);
    }
    return this.contractRepository.find({ where, relations: ['customer'] });
  }

  async getContractById(id: number): Promise<Contract> {
    const contract = await this.contractRepository.findOne({
      where: { id },
      relations: ['customer', 'products', 'discounts'],
    });
    if (contract) {
      return contract;
    }
    throw new ContractNotFoundException(id);
  }

  async getValidContract(query: GetValidContractDto): Promise<Contract> {
    const where: FindManyOptions<Contract>['where'] = {};
    where.customerId = Equal(query.customerId);
    where.endAt = MoreThanOrEqual(new Date());
    where.products = { id: In(query.productIds) };
    return await this.contractRepository.findOne({
      where,
      relations: ['discounts'],
    });
  }

  async updateContract(
    user: GetUserDto,
    id: number,
    contract: UpdateContractDto,
  ): Promise<Contract> {
    const updateContract = await this.getContractById(id);
    updateContract.updatedBy = user.id;
    if (contract.productIds.length > 0) {
      updateContract.products = await this.productService.getProducts({
        ids: contract.productIds,
      });
    }
    if (contract.discountIds.length > 0) {
      updateContract.discounts = await this.discountService.getAllDiscount({
        ids: contract.discountIds,
      });
    }
    if (contract.currentAt) {
      updateContract.currentAt = contract.currentAt;
    }
    if (contract.endAt) {
      updateContract.endAt = contract.endAt;
    }
    if (contract.customerId) {
      updateContract.customerId = contract.customerId;
    }
    if (contract.amount) {
      updateContract.amount = contract.amount;
    }
    if (contract.attachmentId) {
      updateContract.attachmentId = contract.attachmentId;
    }

    return await updateContract.save();
  }
}
