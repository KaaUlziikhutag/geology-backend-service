import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Price from './price.entity';
import { Repository } from 'typeorm';
import GetPriceDto from './dto/get-price.dto';
import PriceNotFoundException from './exceptions/price-not-found.exception';
import PageDto from '../../utils/dto/page.dto';
import PageMetaDto from '../../utils/dto/page-meta.dto';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
  ) {}

  async getPrice(query: GetPriceDto): Promise<PageDto<Price>> {
    const { page, skip, limit, order } = query;
    const qb = this.priceRepository.createQueryBuilder('price');
    qb.leftJoinAndSelect('price.laboratory', 'laboratory');
    qb.leftJoinAndSelect('price.product', 'product');
    qb.leftJoinAndSelect('product.section', 'section');
    qb.leftJoinAndSelect('price.mineralType', 'mineralType');
    qb.leftJoinAndSelect('price.element', 'element');
    qb.leftJoinAndSelect('price.technology', 'technology');
    // qb.innerJoinAndMapOne(
    //   'price.decision',
    //   (subQuery) => {
    //     return subQuery
    //       .select('id')
    //       .from(Decision, 'decision')
    //       .where('decision.ruleAt < :now', { now: new Date() })
    //       .orderBy('decision.ruleAt', 'DESC')
    //       .limit(1);
    //   },
    //   'decision',
    //   'decision.id = price.decisionId',
    // );
    qb.skip(skip);
    qb.take(limit);
    qb.orderBy('price.amount', order);
    qb.where('price.isActive = :isActive', { isActive: true });
    if (query.sectionId) {
      qb.andWhere('product.sectionId = :sectionId', {
        sectionId: query.sectionId,
      });
    }
    if (query.productType) {
      qb.andWhere('product.type = :type', {
        type: query.productType,
      });
    }
    if (query.productIds) {
      qb.andWhere('price.productId IN (:...productIds)', {
        productIds: query.productIds,
      });
    }
    if (query.technologyIds) {
      qb.andWhere('price.technologyId IN (:...technologyIds)', {
        technologyIds: query.technologyIds,
      });
    }
    if (query.mineralTypeIds) {
      qb.andWhere('price.mineralTypeId IN (:...mineralTypeIds)', {
        mineralTypeIds: query.mineralTypeIds,
      });
    }
    if (query.elementIds) {
      qb.andWhere('price.elementId IN (:...elementIds)', {
        elementIds: query.elementIds,
      });
    }
    const [items, itemCount] = await qb.getManyAndCount();
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }
  async getPriceById(id: number): Promise<Price> {
    const qb = this.priceRepository.createQueryBuilder('price');
    qb.leftJoinAndSelect('price.laboratory', 'laboratory');
    qb.leftJoinAndSelect('price.product', 'product');
    qb.leftJoinAndSelect('product.section', 'section');
    qb.leftJoinAndSelect('price.mineralType', 'mineralType');
    qb.leftJoinAndSelect('price.element', 'element');
    qb.leftJoinAndSelect('price.technology', 'technology');
    // qb.innerJoinAndMapOne(
    //   'price.decision',
    //   (subQuery) => {
    //     return subQuery
    //       .select('id')
    //       .from(Decision, 'decision')
    //       .where('decision.ruleAt < :now', { now: new Date() })
    //       .orderBy('decision.ruleAt', 'DESC')
    //       .limit(1);
    //   },
    //   'decision',
    //   'decision.id = price.decisionId',
    // );
    qb.where('price.isActive = :isActive', { isActive: true });
    qb.andWhere('price.id = :id', { id });
    const price = await qb.getOne();
    if (price) {
      return price;
    }
    throw new PriceNotFoundException(id);
  }
}
