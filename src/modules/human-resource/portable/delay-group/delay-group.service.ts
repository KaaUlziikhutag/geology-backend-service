import { Injectable } from '@nestjs/common';
import { CreateDelayGroupDto } from './dto/create-delay-group.dto';
import { UpdateDelayGroupDto } from './dto/update-delay-group.dto';
import { GetDelayGroupDto } from './dto/get-delay-group.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import DelayGroups from './delay-group.entity';
import DelayGroupNotFoundException from './exceptions/delay-group-not-found.exception';
import { PageDto } from '../../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../cloud/user/dto/get-user.dto';

@Injectable()
export class DelayGroupService {
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
   * A method that fetches the DelayGroup from the database
   * @returns A promise with the list of DelayGroups
   */
  async getAllDelayGroups(query: GetDelayGroupDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<DelayGroups>['where'] = {};
    if (query.note) {
      where.note = Equal(query.note);
    }
    if (query.itemId) {
      where.itemId = Equal(query.itemId);
    }
    const skip = (query.page - 1) * query.limit;

    const [items, count] = await entityManager.findAndCount(DelayGroups, {
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
   * A method that fetches a DelayGroup with a given id. Example:
   *
   * @example
   * const DelayGroup = await DelayGroupService.getDelayGroupById(1);
   */
  async getDelayGroupById(
    delayGroupId: number,
    user: GetUserDto,
  ): Promise<DelayGroups> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const delayGroup = await entityManager.findOne(DelayGroups, {
      where: { id: delayGroupId },
    });
    if (delayGroup) {
      return delayGroup;
    }
    throw new DelayGroupNotFoundException(delayGroupId);
  }

  /**
   *
   * @param DelayGroup createDelayGroup
   *
   */
  async createDelayGroup(delayGroup: CreateDelayGroupDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newDelayGroup = entityManager.create(DelayGroups, delayGroup);
    await entityManager.save(newDelayGroup);
    return newDelayGroup;
  }

  /**
   * See the [definition of the UpdateDelayGroupDto file]{@link UpdateDelayGroupDto} to see a list of required properties
   */
  async updateDelayGroup(
    id: number,
    user: GetUserDto,
    delayGroup: UpdateDelayGroupDto,
  ): Promise<DelayGroups> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(DelayGroups, id, delayGroup);
    const updatedDelayGroup = await entityManager.findOne(DelayGroups, {
      where: { id: id },
    });
    if (updatedDelayGroup) {
      return updatedDelayGroup;
    }
    throw new DelayGroupNotFoundException(id);
  }

  /**
   * @deprecated Use deleteDelayGroup instead
   */
  async deleteDelayGroupById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteDelayGroup(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteDelayGroup(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(DelayGroups, id);
    if (!deleteResponse.affected) {
      throw new DelayGroupNotFoundException(id);
    }
  }
}
