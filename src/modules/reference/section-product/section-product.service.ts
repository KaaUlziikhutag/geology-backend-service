import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import GetReferenceDto from '../dto/get-reference.dto';
import SectionProduct from './section-product.entity';

@Injectable()
export class SectionProductService {
  constructor(
    @InjectRepository(SectionProduct)
    private sectionRepository: Repository<SectionProduct>,
  ) {}

  async getAllSection(query: GetReferenceDto): Promise<SectionProduct[]> {
    let where: FindManyOptions<SectionProduct>['where'] = {};
    if (query.search) {
      where = [
        { code: ILike(`%${query.search}%`) },
        { name: ILike('%' + query.search + '%') },
      ];
    }
    return this.sectionRepository.find({ where });
  }
}
