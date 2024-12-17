import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Measurement from './measurement.entity.js';
import GetReferenceDto from '../dto/get-reference.dto.js';
import { FindManyOptions, ILike, Repository } from 'typeorm';

@Injectable()
export class MeasurementService {
  constructor(
    @InjectRepository(Measurement)
    private readonly measureRepository: Repository<Measurement>,
  ) {}

  async getAllMeasure(query: GetReferenceDto): Promise<Measurement[]> {
    let where: FindManyOptions<Measurement>['where'] = {};
    if (query.search) {
      where = [
        { code: ILike(`%${query.search}%`) },
        { name: ILike(`%${query.search}%`) },
      ];
    }
    return this.measureRepository.find({ where });
  }
}
