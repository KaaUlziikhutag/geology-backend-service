import { Injectable } from '@nestjs/common';
import { CreateInsuranceTypeDto } from './dto/create-insurance-type.dto';
import { UpdateInsuranceTypeDto } from './dto/update-insurance-type.dto';
import { GetInsuranceTypeDto } from './dto/get-insurance-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import InsuranceType from './insurance-type.entity';
import InsuranceTypeNotFoundException from './exceptions/insurance-type-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';

@Injectable()
export class InsuranceTypeService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(InsuranceType)
    private readonly insuranceTypeRepository: Repository<InsuranceType>,
  ) {}

  /**
   * A method that fetches the companies from the database
   * @returns A promise with the list of InsuranceTypes
   */
  async getAll(query: GetInsuranceTypeDto) {
    const where: FindManyOptions<InsuranceType>['where'] = {};
    const { skip, page } = query;

    if (query.code) {
      where.code = ILike('%' + query.code + '%');
    }
    if (query.name) {
      where.name = ILike('%' + query.name + '%');
    }

    const [items, count] = await this.insuranceTypeRepository.findAndCount({
      where,
      order: {
        createdAt: 'ASC',
      },
      skip: skip,
      // take параметрыг арилгаж бүх өгөгдлийг буцаана
    });

    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit: count, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a InsuranceType with a given id. Example:
   *
   * @example
   * const InsuranceType = await InsuranceTypeService.getInsuranceTypeById(1);
   */
  async getById(id: number): Promise<InsuranceType> {
    const InsuranceType = await this.insuranceTypeRepository.findOne({
      where: { id },
    });
    if (InsuranceType) {
      return InsuranceType;
    }
    throw new InsuranceTypeNotFoundException(id);
  }

  /**
   *
   * @param InsuranceType createInsuranceType
   *
   */
  async create(dto: CreateInsuranceTypeDto) {
    const newInsuranceType = this.insuranceTypeRepository.create(dto);
    return await this.insuranceTypeRepository.save(newInsuranceType);
  }

  /**
   * See the [definition of the UpdateInsuranceTypeDto file]{@link UpdateInsuranceTypeDto} to see a list of required properties
   */
  async updateById(
    id: number,
    dto: UpdateInsuranceTypeDto,
  ): Promise<InsuranceType> {
    await this.insuranceTypeRepository.update(id, dto);
    return await this.getById(id);
  }
  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteById(id: number): Promise<void> {
    const deleteResponse = await this.insuranceTypeRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new InsuranceTypeNotFoundException(id);
    }
  }
}
