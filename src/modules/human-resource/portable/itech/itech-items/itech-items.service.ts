import { Injectable } from '@nestjs/common';
import { CreateItechItemDto } from './dto/create-itech-items.dto';
import { UpdateItechItemDto } from './dto/update-itech-items.dto';
import { GetItechItemDto } from './dto/get-itech-items.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import ItechItems from './itech-items.entity';
import ItechItemNotFoundException from './exceptions/itech-items-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class ItechItemService {
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
   * A method that fetches the ItechItem from the database
   * @returns A promise with the list of ItechItems
   */
  async getAllItechItems(query: GetItechItemDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<ItechItems>['where'] = {};
    if (query.userId) {
      where.userId = Equal(query.userId);
    }

    if (query.itechId) {
      where.itechId = Equal(query.itechId);
    }
    const page =
      query.page && !isNaN(query.page) && query.page > 0
        ? Number(query.page)
        : 1;

    let limit: number | undefined;

    if (query.limit && !isNaN(query.limit) && query.limit > 0) {
      limit = Number(query.limit);
    }

    const skip = (page - 1) * (limit || 0);

    const [items, count] = await entityManager.findAndCount(ItechItems, {
      where,
      order: {
        createdAt: 'DESC',
      },
      skip,
      take: limit,
    });

    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a ItechItem with a given id. Example:
   *
   * @example
   * const ItechItem = await ItechItemService.getItechItemById(1);
   */
  async getItechItemById(
    itechItemId: number,
    user: IUser,
  ): Promise<ItechItems> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const itechItem = await entityManager.findOne(ItechItems, {
      where: { id: itechItemId },
    });
    if (itechItem) {
      return itechItem;
    }
    throw new ItechItemNotFoundException(itechItemId);
  }

  /**
   *
   * @param ItechItem createItechItem
   *
   */
  async createItechItem(itechItem: CreateItechItemDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newItechItem = entityManager.create(ItechItems, itechItem);
    await entityManager.save(newItechItem);
    return newItechItem;
  }

  /**
   * See the [definition of the UpdateItechItemDto file]{@link UpdateItechItemDto} to see a list of required properties
   */
  async updateItechItem(
    id: number,
    user: IUser,
    itechItem: UpdateItechItemDto,
  ): Promise<ItechItems> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(ItechItems, id, itechItem);
    const updatedItechItem = await entityManager.findOne(ItechItems, {
      where: { id: id },
    });
    if (updatedItechItem) {
      return updatedItechItem;
    }
    throw new ItechItemNotFoundException(id);
  }

  /**
   * @deprecated Use deleteItechItem instead
   */
  async deleteItechItemById(id: number, user: IUser): Promise<void> {
    return this.deleteItechItem(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteItechItem(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(ItechItems, id);
    if (!deleteResponse.affected) {
      throw new ItechItemNotFoundException(id);
    }
  }
}
