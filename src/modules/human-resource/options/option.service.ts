import { Injectable } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { GetOptionDto } from './dto/get-option.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Option from './option.entity';
import OptionNotFoundException from './exceptions/option-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class OptionService {
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
   * A method that fetches the Option from the database
   * @returns A promise with the list of Options
   */
  async getAllOptions(query: GetOptionDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Option>['where'] = {};

    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    const skip = (query.page - 1) * query.limit;

    const [items, count] = await entityManager.findAndCount(Option, {
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
   * A method that fetches a Option with a given id. Example:
   *
   * @example
   * const Option = await OptionService.getOptionById(1);
   */
  async getOptionById(optionId: number, user: IUser): Promise<Option> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const option = await entityManager.findOne(Option, {
      where: { id: optionId },
    });
    if (option) {
      return option;
    }
    throw new OptionNotFoundException(optionId);
  }

  /**
   *
   * @param Option createOption
   *
   */
  async createOption(option: CreateOptionDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newOption = entityManager.create(Option, option);
    await entityManager.save(newOption);
    return newOption;
  }

  /**
   * See the [definition of the UpdateOptionDto file]{@link UpdateOptionDto} to see a list of required properties
   */
  async updateOption(
    id: number,
    user: IUser,
    option: UpdateOptionDto,
  ): Promise<Option> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Option, id, option);
    const updatedOption = await entityManager.findOne(Option, {
      where: { id: id },
    });
    if (updatedOption) {
      return updatedOption;
    }
    throw new OptionNotFoundException(id);
  }

  /**
   * @deprecated Use deleteOption instead
   */
  async deleteOptionById(id: number, user: IUser): Promise<void> {
    return this.deleteOption(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteOption(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(Option, id);
    if (!deleteResponse.affected) {
      throw new OptionNotFoundException(id);
    }
  }
}
