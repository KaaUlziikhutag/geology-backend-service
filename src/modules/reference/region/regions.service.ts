import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Region from './entities/region.entity';
import { Equal, FindManyOptions, Repository } from 'typeorm';
import FindRegionDto from './dto/find-region.dto';

@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
  ) {}

  async findAll(dto: FindRegionDto) {
    const where: FindManyOptions<Region>['where'] = {};
    if (dto.level) {
      where.level = Equal(dto.level);
    }
    if (dto.parentId) {
      where.parentId = Equal(dto.parentId);
    }
    return this.regionRepository.find({
      where,
      relations: ['children.children.children'],
      order: { position: 'ASC' },
    });
  }

  async findOne(id: number) {
    return this.regionRepository.findOne({ where: { id } });
  }
}
