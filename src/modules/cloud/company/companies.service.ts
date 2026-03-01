import { Injectable } from '@nestjs/common';
import { CreateCompaniesDto } from './dto/create-companies.dto';
import { UpdateCompaniesDto } from './dto/update-companies.dto';
import { GetCompaniesDto } from './dto/get-companies.dto';
import { Equal, FindManyOptions, Repository } from 'typeorm';
import Companies from './companies.entity';
import CompaniesNotFoundException from './exceptions/companies-not-found.exception';
import { PageDto } from '../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../utils/dto/pageMeta.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CompaniesService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(Companies)
    private companiesRepository: Repository<Companies>,
  ) {}

  /**
   * A method that fetches the Companies from the database
   * @returns A promise with the list of Companiess
   */
  async getAllCompaniess(query: GetCompaniesDto) {
    const where: FindManyOptions<Companies>['where'] = {};
    if (query.userCnt) {
      where.userCnt = Equal(query.userCnt);
    }
    const page =
      query.page && !isNaN(query.page) && query.page > 0
        ? Number(query.page)
        : 1;
    const limit =
      query.limit && !isNaN(query.limit) && query.limit > 0
        ? Number(query.limit)
        : 10;
    const skip = (page - 1) * limit;
    const [items, count] = await this.companiesRepository.findAndCount({
      where,
      order: {
        createdAt: 'DESC',
      },
      skip: skip,
      take: limit,
    });
    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  getAllCompany(): Promise<Companies[]> {
    return this.companiesRepository.find();
  }

  /**
   * A method that fetches a Companies with a given id. Example:
   *
   * @example
   * const Companies = await CompaniesService.getCompaniesById(1);
   */
  async getCompaniesById(companiesId: number): Promise<Companies> {
    const companies = await this.companiesRepository.findOne({
      where: { id: companiesId },
    });
    if (companies) {
      return companies;
    }
    throw new CompaniesNotFoundException(companiesId);
  }

  /**
   *
   * @param Companies createCompanies
   *
   */
  async createCompanies(companies: CreateCompaniesDto) {
    const newCompanies = this.companiesRepository.create(companies);
    await this.companiesRepository.save(newCompanies);
    return newCompanies;
  }

  /**
   * See the [definition of the UpdateCompaniesDto file]{@link UpdateCompaniesDto} to see a list of required properties
   */
  async updateCompanies(
    id: number,
    companies: UpdateCompaniesDto,
  ): Promise<Companies> {
    await this.companiesRepository.update(id, companies);
    const updatedCompanies = await this.companiesRepository.findOne({
      where: { id: id },
    });
    if (updatedCompanies) {
      return updatedCompanies;
    }
    throw new CompaniesNotFoundException(id);
  }

  /**
   * @deprecated Use deleteCompanies instead
   */
  async deleteCompaniesById(id: number): Promise<void> {
    return this.deleteCompanies(id);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteCompanies(id: number): Promise<void> {
    const deleteResponse = await this.companiesRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new CompaniesNotFoundException(id);
    }
  }
}
