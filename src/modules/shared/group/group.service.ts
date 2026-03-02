import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GetGroupDto } from './dto/get-group.dto';
import { EntityManager, Equal, FindManyOptions, Repository } from 'typeorm';
import Groups from './group.entity';
import GroupNotFoundException from './exceptions/group-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GroupService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(Groups)
    private groupsRepository: Repository<Groups>,
    private moduleRef: ModuleRef,
  ) {}

  private async loadEntityManager(systemId: string): Promise<EntityManager> {
    return this.moduleRef.get(getEntityManagerToken(`ioffice_${systemId}`), {
      strict: false,
    });
  }

  /**
   * A method that fetches the Group from the database
   * @returns A promise with the list of Groups
   */
  async getAllGroups(query: GetGroupDto) {
    const where: FindManyOptions<Groups>['where'] = {};
    if (query.pro) {
      where.pro = Equal(query.pro);
    }
    const skip = (query.page - 1) * query.limit;

    const [items, count] = await this.groupsRepository.findAndCount({
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
  async getGroupById(groupId: number): Promise<Groups> {
    const group = await this.groupsRepository.findOne({
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
  async createGroup(group: CreateGroupDto) {
    const newGroup = this.groupsRepository.create(group);
    return await this.groupsRepository.save(newGroup);
  }

  /**
   * See the [definition of the UpdateGroupDto file]{@link UpdateGroupDto} to see a list of required properties
   */
  async updateGroup(id: number, group: UpdateGroupDto): Promise<Groups> {
    await this.groupsRepository.update(id, group);
    const updatedGroup = await this.groupsRepository.findOne({
      where: { id },
    });
    if (updatedGroup) {
      return updatedGroup;
    }
    throw new GroupNotFoundException(id);
  }

  /**
   * @deprecated Use deleteGroup instead
   */
  async deleteGroupById(id: number): Promise<void> {
    return this.deleteGroup(id);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteGroup(id: number): Promise<void> {
    const deleteResponse = await this.groupsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new GroupNotFoundException(id);
    }
  }
}
