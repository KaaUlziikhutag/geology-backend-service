import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { GetCompanyDto } from './dto/get-company.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Companies from '../access/entities/company-limit.entity';
import CompanyNotFoundException from './exceptions/company-not-found.exception';
import { PageDto } from '../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../cloud/user/dto/get-user.dto';

@Injectable()
export class CompanyService {
  /**
   * @ignore
   */
  constructor(private moduleRef: ModuleRef) {}

  private async loadEntityManager(systemId: string): Promise<EntityManager> {
    return this.moduleRef.get(getEntityManagerToken(`ioffice_${systemId}`), {
      strict: false,
    });
  }

  /**
   * A method that fetches the Company from the database
   * @returns A promise with the list of Companys
   */
  async getAllCompanys(query: GetCompanyDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Companies>['where'] = {};
    if (query.itemId) {
      where.itemId = Equal(query.itemId);
    }
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    const skip = (query.page - 1) * query.limit;

    const [items, count] = await entityManager.findAndCount(Companies, {
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
  async getCompanyById(
    companyId: number,
    user: GetUserDto,
  ): Promise<Companies> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const company = await entityManager.findOne(Companies, {
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
  async createCompany(company: CreateCompanyDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newCompany = entityManager.create(Companies, company);
    await entityManager.save(newCompany);
    return newCompany;
  }

  /**
   * See the [definition of the UpdateCompanyDto file]{@link UpdateCompanyDto} to see a list of required properties
   */
  async updateCompany(
    id: number,
    user: GetUserDto,
    company: UpdateCompanyDto,
  ): Promise<Companies> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Companies, id, company);
    const updatedCompany = await entityManager.findOne(Companies, {
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
  async deleteCompanyById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteCompany(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteCompany(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(Companies, id);
    if (!deleteResponse.affected) {
      throw new CompanyNotFoundException(id);
    }
  }
}
