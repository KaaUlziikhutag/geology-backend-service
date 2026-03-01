import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Technology from './technology.entity';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import GetReferenceDto from '../dto/get-reference.dto';

@Injectable()
export class TechnologyService {
  constructor(
    @InjectRepository(Technology)
    private technologyRepository: Repository<Technology>,
  ) {}

  async getAllTechnology(query: GetReferenceDto): Promise<Technology[]> {
    let where: FindManyOptions<Technology>['where'] = {};
    if (query.search) {
      where = [
        { code: ILike(`%${query.search}%`) },
        { name: ILike('%' + query.search + '%') },
      ];
    }
    return await this.technologyRepository.find({
      where,
      order: { code: 'ASC' },
    });
  }
}
