import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Discount from './discount.entity.js';
import { FindManyOptions, In, Repository } from 'typeorm';
import GetDiscountDto from './dto/get-discount.dto.js';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
  ) {}

  async getAllDiscount(query: GetDiscountDto): Promise<Discount[]> {
    const where: FindManyOptions<Discount>['where'] = {};
    if (query.ids) {
      where.id = In(query.ids);
    }
    return await this.discountRepository.find({ where });
  }
  async getDiscountById(id: number): Promise<Discount> {
    const discount = await this.discountRepository.findOne({ where: { id } });
    if (!discount) {
      throw new NotFoundException('Discount not found');
    }
    return discount;
  }
}
