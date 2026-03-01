import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import GetReferenceDto from '../dto/get-reference.dto';
import SectionCustomer from './section-customer.entity';

@Injectable()
export class SectionCustomerService {
  constructor(
    @InjectRepository(SectionCustomer)
    private sectionRepository: Repository<SectionCustomer>,
  ) {}

  async getAllSection(query: GetReferenceDto): Promise<SectionCustomer[]> {
    let where: FindManyOptions<SectionCustomer>['where'] = {};
    if (query.search) {
      where = [
        { code: ILike(`%${query.search}%`) },
        { name: ILike('%' + query.search + '%') },
      ];
    }
    return await this.sectionRepository.find({
      where,
      order: { code: 'ASC' },
    });
  }
}
