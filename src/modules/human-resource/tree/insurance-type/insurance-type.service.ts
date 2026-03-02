import { Injectable } from '@nestjs/common';
import { CreateInsuranceTypeDto } from './dto/create-insurance-type.dto';
import { UpdateInsuranceTypeDto } from './dto/update-insurance-type.dto';
import { GetInsuranceTypeDto } from './dto/get-insurance-type.dto';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager, FindManyOptions, ILike } from 'typeorm';
import InsuranceTypes from './insurance-type.entity';
import InsuranceTypeNotFoundException from './exceptions/insurance-type-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class InsuranceTypeService {
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
   * A method that fetches the companies from the database
   * @returns A promise with the list of InsuranceTypes
   */
  async getAllInsuranceTypes(query: GetInsuranceTypeDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<InsuranceTypes>['where'] = {};
    const { skip, page } = query;

    if (query.code) {
      where.code = ILike('%' + query.code + '%');
    }
    if (query.type) {
      where.type = ILike('%' + query.type + '%');
    }

    const [items, count] = await entityManager.findAndCount(InsuranceTypes, {
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
  async getInsuranceTypeById(
    insuranceTypeId: number,
    user: IUser,
  ): Promise<InsuranceTypes> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const InsuranceType = await entityManager.findOne(InsuranceTypes, {
      where: { id: insuranceTypeId },
    });
    if (InsuranceType) {
      return InsuranceType;
    }
    throw new InsuranceTypeNotFoundException(insuranceTypeId);
  }

  /**
   *
   * @param InsuranceType createInsuranceType
   *
   */
  async createInsuranceType(
    insuranceType: CreateInsuranceTypeDto,
    user: IUser,
  ) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newInsuranceType = entityManager.create(
      InsuranceTypes,
      insuranceType,
    );
    await entityManager.save(newInsuranceType);
    return newInsuranceType;
  }

  /**
   * See the [definition of the UpdateInsuranceTypeDto file]{@link UpdateInsuranceTypeDto} to see a list of required properties
   */
  async updateInsuranceType(
    id: number,
    insuranceType: UpdateInsuranceTypeDto,
    user: IUser,
  ): Promise<InsuranceTypes> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(InsuranceTypes, id, insuranceType);
    const updatedInsuranceType = await entityManager.findOne(InsuranceTypes, {
      where: { id: id },
    });
    if (updatedInsuranceType) {
      return updatedInsuranceType;
    }
    throw new InsuranceTypeNotFoundException(id);
  }

  /**
   * @deprecated Use deleteInsuranceType instead
   */
  async deleteInsuranceTypeById(id: number, user: IUser): Promise<void> {
    return this.deleteInsuranceType(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteInsuranceType(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(InsuranceTypes, id);
    if (!deleteResponse.affected) {
      throw new InsuranceTypeNotFoundException(id);
    }
  }
}
