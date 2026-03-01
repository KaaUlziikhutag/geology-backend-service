import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Classification from './classification.entity';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import GetReferenceDto from '../dto/get-reference.dto';

@Injectable()
export class ClassificationService {
  constructor(
    @InjectRepository(Classification)
    private classificationRepository: Repository<Classification>,
  ) {}

  async getAllClassification(
    query: GetReferenceDto,
  ): Promise<Classification[]> {
    let where: FindManyOptions<Classification>['where'] = {};
    if (query.search) {
      where = [
        { code: ILike(`%${query.search}%`) },
        { name: ILike('%' + query.search + '%') },
      ];
    }
    return await this.classificationRepository.find({
      where,
      order: { code: 'ASC' },
    });
  }
}
