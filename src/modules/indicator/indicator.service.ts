import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, FindManyOptions, ILike, Repository } from 'typeorm';
import Indicator from './indicator.entity.js';
import { GetIndicatorDto } from './dto/get-indicator.dto.js';

@Injectable()
export class IndicatorService {
  constructor(
    @InjectRepository(Indicator)
    private readonly indicatorRepository: Repository<Indicator>,
  ) {}

  async getAllIndicator(query: GetIndicatorDto): Promise<Indicator[]> {
    const where: FindManyOptions<Indicator>['where'] = {};
    if (query.name) {
      where.name = ILike(`%${query.name}%`);
    }
    if (query.productId) {
      where.productId = Equal(query.productId);
    }
    if (query.elementId) {
      where.elementId = Equal(query.elementId);
    }
    return this.indicatorRepository.find({
      where,
      relations: ['measurement', 'product', 'element'],
    });
  }
}
