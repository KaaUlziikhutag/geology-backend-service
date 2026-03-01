import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Direction } from './direction.entity';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import GetReferenceDto from '../dto/get-reference.dto';

@Injectable()
export class DirectionService {
  constructor(
    @InjectRepository(Direction)
    private directionRepository: Repository<Direction>,
  ) {}

  async getAllDirection(query: GetReferenceDto): Promise<Direction[]> {
    let where: FindManyOptions<Direction>['where'] = {};
    if (query.search) {
      where = [
        { code: ILike(`%${query.search}%`) },
        { name: ILike('%' + query.search + '%') },
      ];
    }
    return await this.directionRepository.find({
      where,
      order: { code: 'ASC' },
    });
  }
}
