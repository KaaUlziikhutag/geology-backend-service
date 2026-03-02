import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { GetCompanyDto } from './dto/get-company.dto';
import { EntityManager, Equal, FindManyOptions, Repository } from 'typeorm';
import Companies from '../access/entities/company-limit.entity';
import CompanyNotFoundException from './exceptions/company-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CompanyService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(Companies)
    private readonly companyRepository: Repository<Companies>,
    private moduleRef: ModuleRef,
  ) {}

  private async loadEntityManager(systemId: string): Promise<EntityManager> {
    return this.moduleRef.get(getEntityManagerToken(`ioffice_${systemId}`), {
      strict: false,
    });
  }

  /**
   * A method that fetches the Company from the database
   * @returns A promise with the list of Companys
   */
  async getAllCompanys(query: GetCompanyDto) {
    const where: FindManyOptions<Companies>['where'] = {};
    if (query.itemId) {
      where.itemId = Equal(query.itemId);
    }
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    const skip = (query.page - 1) * query.limit;

    const [items, count] = await this.companyRepository.findAndCount({
      where,
      order: {
        createdAt: 'DESC',
      },
      skip: skip,
      take: query.limit,
    });

    const page = Number(query.page);
    const limit = Number(query.limit);
    const itemCount = count;

    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });

    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a Company with a given id. Example:
   *
   * @example
   * const Company = await CompanyService.getCompanyById(1);
   */
  async getCompanyById(companyId: number): Promise<Companies> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });
    if (company) {
      return company;
    }
    throw new CompanyNotFoundException(companyId);
  }

  /**
   *
   * @param Company createCompany
   *
   */
  async createCompany(company: CreateCompanyDto) {
    const newCompany = this.companyRepository.create(company);
    return await this.companyRepository.save(newCompany);
  }

  /**
   * See the [definition of the UpdateCompanyDto file]{@link UpdateCompanyDto} to see a list of required properties
   */
  async updateCompany(
    id: number,
    company: UpdateCompanyDto,
  ): Promise<Companies> {
    await this.companyRepository.update(id, company);
    const updatedCompany = await this.companyRepository.findOne({
      where: { id: id },
    });
    if (updatedCompany) {
      return updatedCompany;
    }
    throw new CompanyNotFoundException(id);
  }

  /**
   * @deprecated Use deleteCompany instead
   */
  async deleteCompanyById(id: number): Promise<void> {
    return this.deleteCompany(id);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteCompany(id: number): Promise<void> {
    const deleteResponse = await this.companyRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new CompanyNotFoundException(id);
    }
  }
}
