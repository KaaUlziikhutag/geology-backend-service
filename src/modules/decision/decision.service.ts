import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Decision from './decision.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class DecisionService {
  constructor(
    @InjectRepository(Decision)
    private readonly decisionRepository: Repository<Decision>,
  ) {}

  async getAll(): Promise<Decision[]> {
    // const where: FindManyOptions<Decision>['where'] = {};
    return await this.decisionRepository.find();
  }
}
