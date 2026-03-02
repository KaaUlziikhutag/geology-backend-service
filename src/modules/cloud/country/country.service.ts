import { Injectable } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { GetCountryDto } from './dto/get-country.dto';
import { Equal, FindManyOptions, ILike, In, Repository } from 'typeorm';
import Country from './country.entity';
import CountryNotFoundException from './exceptions/country.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { CountryType } from '@utils/enum-utils';

@Injectable()
export class CountryService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) {}
  /**
   * A method that fetches the companyCountrys from the database
   * @returns A promise with the list of companyCountrys
   */

  async getAllCountries(query: GetCountryDto) {
    const where: FindManyOptions<Country>['where'] = {};

    if (query.ids) where.id = In(query.ids);
    if (query.parentId) where.parentId = Equal(query.parentId);
    if (query.position) where.position = Equal(query.position);
    if (query.name) where.name = ILike(`%${query.name}%`);
    if (query.type) where.type = Equal(query.type as CountryType);

    // Page and limit handling
    const page = query.page && query.page > 0 ? Number(query.page) : 1;
    const limit =
      query.limit !== undefined && query.limit !== 10
        ? Number(query.limit)
        : undefined;
    const skip = limit ? (page - 1) * limit : undefined;

    // Fetch all data if no valid limit is specified
    const [data, count] = await this.countryRepository.findAndCount({
      where,
      order: { position: 'ASC' },
      relations: ['children'],
      skip,
      take: limit, // Fetch all if limit is undefined
    });

    const itemCount = count;
    const pageCount = limit ? Math.ceil(itemCount / limit) : 1;
    const hasPreviousPage = limit ? page > 1 : false;
    const hasNextPage = limit ? page < pageCount : false;

    // Return items with proper meta information
    return {
      data,
      meta: {
        page,
        limit: limit || itemCount,
        itemCount,
        pageCount,
        hasPreviousPage,
        hasNextPage,
      },
    };
  }

  /**
   * A method that fetches a company with a given id. Example:
   *
   * @example
   * const companyCountry = await companyCountryService.getCompanyCountryById(1);
   */
  async getCountryById(id: number): Promise<Country> {
    const country = await this.countryRepository.findOne({
      where: { id: id },
      relations: ['parent', 'parent.parent', 'parent.parent.parent'],
    });
    if (country) {
      return country;
    }
    throw new CountryNotFoundException(id);
  }

  async restoreDeletedCountry(id: number) {
    const restoreResponse = await this.countryRepository.restore(id);
    if (!restoreResponse.affected) {
      throw new CountryNotFoundException(id);
    }
  }

  async createCountry(country: CreateCountryDto) {
    const newCountry = this.countryRepository.create(country);
    await this.countryRepository.save(newCountry);
    return newCountry;
  }

  /**
   * See the [definition of the UpdateCompanyCountryDto file]{@link UpdateCountryDto} to see a list of required properties
   */
  async updateCountry(id: number, country: UpdateCountryDto): Promise<Country> {
    await this.countryRepository.update(id, country);
    const updatedCountry = await this.countryRepository.findOne({
      where: { id: id },
    });
    if (updatedCountry) {
      return updatedCountry;
    }
    throw new CountryNotFoundException(id);
  }

  /**
   * A method that deletes a companyCountry from the database
   * @param id An id of a companyCountry. A companyCountry with this id should exist in the database
   */
  async deleteCountry(id: number): Promise<void> {
    const deleteResponse = await this.countryRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new CountryNotFoundException(id);
    }
  }
}
