import { Injectable } from '@nestjs/common';
import { CreateDirectLostDto } from './dto/create-lost.dto';
import { UpdateDirectLostDto } from './dto/update-lost.dto';
import { GetDirectLostDto } from './dto/get-lost.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import DirectLosts from './lost.entity';
import DirectLostNotFoundException from './exceptions/lost-not-found.exception';
import { PageDto } from '../../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../cloud/user/dto/get-user.dto';

@Injectable()
export class DirectLostService {
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
   * A method that fetches the DirectLost from the database
   * @returns A promise with the list of DirectLosts
   */
  async getAllDirectLosts(query: GetDirectLostDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<DirectLosts>['where'] = {};
    if (query.directId) {
      where.directId = Equal(query.directId);
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
    const [items, count] = await entityManager.findAndCount(DirectLosts, {
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

  /**
   * A method that fetches a DirectLost with a given id. Example:
   *
   * @example
   * const DirectLost = await DirectLostService.getDirectLostById(1);
   */
  async getDirectLostById(
    directLostId: number,
    user: GetUserDto,
  ): Promise<DirectLosts> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const directLost = await entityManager.findOne(DirectLosts, {
      where: { id: directLostId },
    });
    if (directLost) {
      return directLost;
    }
    throw new DirectLostNotFoundException(directLostId);
  }

  /**
   *
   * @param DirectLost createDirectLost
   *
   */
  async createDirectLost(directLost: CreateDirectLostDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newDirectLost = entityManager.create(DirectLosts, directLost);
    await entityManager.save(newDirectLost);
    return newDirectLost;
  }

  /**
   * See the [definition of the UpdateDirectLostDto file]{@link UpdateDirectLostDto} to see a list of required properties
   */
  async updateDirectLost(
    id: number,
    user: GetUserDto,
    directLost: UpdateDirectLostDto,
  ): Promise<DirectLosts> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(DirectLosts, id, directLost);
    const updatedDirectLost = await entityManager.findOne(DirectLosts, {
      where: { id: id },
    });
    if (updatedDirectLost) {
      return updatedDirectLost;
    }
    throw new DirectLostNotFoundException(id);
  }

  /**
   * @deprecated Use deleteDirectLost instead
   */
  async deleteDirectLostById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteDirectLost(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteDirectLost(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(DirectLosts, id);
    if (!deleteResponse.affected) {
      throw new DirectLostNotFoundException(id);
    }
  }
}
