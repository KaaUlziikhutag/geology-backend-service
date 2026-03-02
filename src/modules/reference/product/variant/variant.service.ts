import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ProductVariant from './variant.entity';
import { Repository } from 'typeorm';
import CreateVarianDto from './dto/create-variant.dto';
import UpdateVariantDto from './dto/update-variant.dto';

@Injectable()
export default class VariantService {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
  ) {}

  async getById(id: number): Promise<ProductVariant> {
    const variant = await this.variantRepo.findOne({
      where: { id },
      relations: ['variantOptions.attribute', 'variantOptions.option'],
    });
    return variant;
  }

  async getUseCartById(id: number): Promise<ProductVariant> {
    return await this.variantRepo.findOne({
      where: { id },
      relations: ['product'],
    });
  }

  async create(dto: CreateVarianDto): Promise<ProductVariant> {
    const newVariant = this.variantRepo.create(dto);
    return await this.variantRepo.save(newVariant);
  }

  async update(id: number, dto: UpdateVariantDto): Promise<ProductVariant> {
    const updateResponse = await this.variantRepo.update(id, dto);
    if (!updateResponse.affected) {
      throw new NotFoundException(`Variant is not found ${id}`);
    }
    return await this.getById(id);
  }

  async delete(id: string): Promise<void> {
    const deleteResponse = await this.variantRepo.delete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException(`Variant is not found ${id}`);
    }
  }
}
