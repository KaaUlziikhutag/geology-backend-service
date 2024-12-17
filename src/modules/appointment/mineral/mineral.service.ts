import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Mineral from './mineral.entity.js';
import { Equal, FindManyOptions, ILike, In, Repository } from 'typeorm';
import GetMineralDto from './dto/get-mineral.dto.js';
import PageMetaDto from '../../../utils/dto/page-meta.dto.js';
import PageDto from '../../../utils/dto/page.dto.js';
import MineralNotFoundException from './exceptions/mineral-not-found.exception.js';
import CreateMineralDto from './dto/create-mineral.dto.js';
import UpdateMineralDto from './dto/update-mineral.dto.js';

@Injectable()
export class MineralService {
  constructor(
    @InjectRepository(Mineral)
    private mineralRepository: Repository<Mineral>,
  ) {}

  async getAllMineral(query: GetMineralDto) {
    const { page, skip, limit, order } = query;
    const where: FindManyOptions<Mineral>['where'] = {};
    if (query.appointmentId) {
      where.appointmentId = Equal(query.appointmentId);
    }
    if (query.name) {
      where.name = ILike(`%${query.name}%`);
    }
    if (query.state) {
      where.state = Equal(query.state);
    }
    const [items, itemCount] = await this.mineralRepository.findAndCount({
      where,
      skip,
      take: limit,
      relations: ['mineralType', 'tasks.order'],
      order: { createdAt: order },
    });
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }
  async getMineralByIds(ids: number[]): Promise<Mineral[]> {
    const minerals = await this.mineralRepository.findBy({ id: In(ids) });
    if (minerals.length == 0) {
      throw new NotFoundException(`Mineral with ids: ${ids} not found`);
    }
    return minerals;
  }
  async getMineralById(id: number): Promise<Mineral> {
    const mineral = await this.mineralRepository.findOne({
      where: { id },
      relations: ['appointment'],
    });
    if (mineral) {
      return mineral;
    }
    throw new MineralNotFoundException(id);
  }
  async createMineral(mineral: CreateMineralDto): Promise<Mineral> {
    const newMineral = this.mineralRepository.create(mineral);
    await this.mineralRepository.save(newMineral);
    return newMineral;
  }
  async updateMineral(id: number, mineral: UpdateMineralDto): Promise<Mineral> {
    await this.mineralRepository.update(id, mineral);
    return await this.getMineralById(id);
  }
  async deleteMineral(id: number): Promise<void> {
    const deleteResponse = await this.mineralRepository.softDelete(id);
    if (!deleteResponse.affected) {
      throw new MineralNotFoundException(id);
    }
  }
}
