import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GetGroupDto } from './dto/get-group.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Groups from './group.entity';
import GroupNotFoundException from './exceptions/group-not-found.exception';
import { PageDto } from '../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../cloud/user/dto/get-user.dto';

@Injectable()
export class GroupService {
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
   * A method that fetches the Group from the database
   * @returns A promise with the list of Groups
   */
  async getAllGroups(query: GetGroupDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Groups>['where'] = {};
    if (query.pro) {
      where.pro = Equal(query.pro);
    }
    const skip = (query.page - 1) * query.limit;

    const [items, count] = await entityManager.findAndCount(Groups, {
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
   * A method that fetches a Group with a given id. Example:
   *
   * @example
   * const Group = await GroupService.getGroupById(1);
   */
  async getGroupById(groupId: number, user: GetUserDto): Promise<Groups> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const group = await entityManager.findOne(Groups, {
      where: { id: groupId },
    });
    if (group) {
      return group;
    }
    throw new GroupNotFoundException(groupId);
  }

  /**
   *
   * @param Group createGroup
   *
   */
  async createGroup(group: CreateGroupDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newGroup = entityManager.create(Groups, group);
    await entityManager.save(newGroup);
    return newGroup;
  }

  /**
   * See the [definition of the UpdateGroupDto file]{@link UpdateGroupDto} to see a list of required properties
   */
  async updateGroup(
    id: number,
    user: GetUserDto,
    group: UpdateGroupDto,
  ): Promise<Groups> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Groups, id, group);
    const updatedGroup = await entityManager.findOne(Groups, {
      where: { id: id },
    });
    if (updatedGroup) {
      return updatedGroup;
    }
    throw new GroupNotFoundException(id);
  }

  /**
   * @deprecated Use deleteGroup instead
   */
  async deleteGroupById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteGroup(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteGroup(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(Groups, id);
    if (!deleteResponse.affected) {
      throw new GroupNotFoundException(id);
    }
  }
}
