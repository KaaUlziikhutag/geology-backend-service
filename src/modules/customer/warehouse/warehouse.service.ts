import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Warehouse from './warehouse.entity.js';
import { Equal, FindManyOptions, ILike, Repository } from 'typeorm';
import CreateWarehouseDto from './dto/create-warehouse.dto.js';
import UpdateWarehouseDto from './dto/update-warehouse.dto.js';
import WarehouseNotFoundException from './exceptions/warehouse-not-found.exception.js';
import GetWarehouseDto from './dto/get-warehouse.dto.js';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
  ) {}

  async createWarehouse(warehouse: CreateWarehouseDto): Promise<Warehouse> {
    const newWarehouse = this.warehouseRepository.create(warehouse);
    return await newWarehouse.save();
  }

  async getWarehouseById(id: number): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.findOneBy({ id });
    if (warehouse) {
      return warehouse;
    }
    throw new WarehouseNotFoundException(id);
  }
  async updateWarehouse(
    id: number,
    warehouse: UpdateWarehouseDto,
  ): Promise<Warehouse> {
    await this.warehouseRepository.update(id, warehouse);
    return await this.getWarehouseById(id);
  }
  async deleteWarehouse(id: number): Promise<void> {
    const deleteResponse = await this.warehouseRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new WarehouseNotFoundException(id);
    }
  }
  async getAllWarehouse(query: GetWarehouseDto): Promise<Warehouse[]> {
    const where: FindManyOptions<Warehouse>['where'] = {};
    if (query.customerId) {
      where.customerId = Equal(query.customerId);
    }
    if (query.code) {
      where.code = Equal(query.code);
    }
    if (query.name) {
      where.name = ILike(`%${query.name}%`);
    }
    return this.warehouseRepository.find({ where });
  }
}
