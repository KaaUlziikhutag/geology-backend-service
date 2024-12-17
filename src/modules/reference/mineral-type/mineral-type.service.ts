import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import MineralType from './mineral-type.entity.js';
import { Equal, FindManyOptions, ILike, Repository } from 'typeorm';
import GetReferenceDto from '../dto/get-reference.dto.js';

@Injectable()
export class MineralTypeService {
  constructor(
    @InjectRepository(MineralType)
    private mineralTypeRepository: Repository<MineralType>,
  ) {}

  async getAllMineralType(query: GetReferenceDto): Promise<MineralType[]> {
    let where: FindManyOptions<MineralType>['where'] = {};
    if (query.search) {
      where = [
        { code: ILike(`%${query.search}%`) },
        { name: ILike('%' + query.search + '%') },
      ];
    }
    return await this.mineralTypeRepository.find({
      where,
      order: { code: 'ASC' },
    });
  }
}
