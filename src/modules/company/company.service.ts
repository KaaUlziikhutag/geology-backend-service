import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Company from './company.entity.js';
import { Repository } from 'typeorm';
import CompanyNotFoundException from './exceptions/company-not-found.exception.js';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
  ) {}

  async getCompanyById(id: number): Promise<Company> {
    const company = this.companyRepository.findOne({
      where: { id },
      relations: ['district'],
    });
    if (company) {
      return company;
    }
    throw new CompanyNotFoundException(id);
  }
}
