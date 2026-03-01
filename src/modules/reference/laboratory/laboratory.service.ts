import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Laboratory from './laboratory.entity';
import { Equal, FindManyOptions, ILike, Repository } from 'typeorm';
import GetReferenceDto from '../dto/get-reference.dto';

@Injectable()
export class LaboratoryService {
  constructor(
    @InjectRepository(Laboratory)
    private laboratoryService: Repository<Laboratory>,
  ) {}
  async getAllLaboratory(query: GetReferenceDto): Promise<Laboratory[]> {
    let where: FindManyOptions<Laboratory>['where'] = {};
    if (query.search) {
      where = [
        { code: ILike(`%${query.search}%`) },
        { name: ILike(`%${query.search}%`) },
      ];
    }
    return await this.laboratoryService.find({
      where,
      order: { code: 'ASC' },
    });
  }
}
