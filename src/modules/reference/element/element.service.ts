import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import GetReferenceDto from '../dto/get-reference.dto.js';
import Element from './element.entity.js';

@Injectable()
export class ElementService {
  constructor(
    @InjectRepository(Element)
    private elementRepository: Repository<Element>,
  ) {}

  async getAllElement(query: GetReferenceDto): Promise<Element[]> {
    let where: FindManyOptions<Element>['where'] = {};
    if (query.search) {
      where = [
        { code: ILike(`%${query.search}%`) },
        { name: ILike('%' + query.search + '%') },
      ];
    }
    return this.elementRepository.find({ where });
  }
}
