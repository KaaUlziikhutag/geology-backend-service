import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Addition from './addition.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdditionService {
  constructor(
    @InjectRepository(Addition)
    private readonly additionRepository: Repository<Addition>,
  ) {}

  async getAllAddition(): Promise<Addition[]> {
    return this.additionRepository.find();
  }
  async getAdditionById(id: number): Promise<Addition> {
    const addition = await this.additionRepository.findOneBy({ id });
    if (addition) {
      return addition;
    }
    throw new NotFoundException('Addition not found');
  }
}
