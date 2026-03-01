import { Injectable } from '@nestjs/common';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import { GetAccessDto } from './dto/get-access.dto';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import AccessNotFoundException from './exceptions/access-not-found.exception';
import { PageDto } from '../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import GetUserDto from '../../cloud/user/dto/get-user.dto';
import UserLimit from './entities/user-limit.entity';

@Injectable()
export class SharedAccessService {
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
   * A method that fetches the Access from the database
   * @returns A promise with the list of Accesss
   */
  async getAllAccesss(query: GetAccessDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<UserLimit>['where'] = {};

    if (query.itemId) {
      where.itemId = Equal(query.itemId);
    }

    if (query.userId) {
      where.userId = Equal(query.userId);
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

    const [items, count] = await entityManager.findAndCount(UserLimit, {
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
   * A method that fetches a Access with a given id. Example:
   *
   * @example
   * const Access = await AccessService.getAccessById(1);
   */
  async getAccessById(accessId: number, user: GetUserDto): Promise<UserLimit> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const access = await entityManager.findOne(UserLimit, {
      where: { id: accessId },
    });
    if (access) {
      return access;
    }
    throw new AccessNotFoundException(accessId);
  }

  /**
   *
   * @param Access createAccess
   *
   */
  async createAccess(access: CreateAccessDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newAccess = entityManager.create(UserLimit, access);
    await entityManager.save(newAccess);
    return newAccess;
  }

  /**
   * See the [definition of the UpdateAccessDto file]{@link UpdateAccessDto} to see a list of required properties
   */
  async updateAccess(
    id: number,
    user: GetUserDto,
    access: UpdateAccessDto,
  ): Promise<UserLimit> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(UserLimit, id, access);
    const updatedAccess = await entityManager.findOne(UserLimit, {
      where: { id: id },
    });
    if (updatedAccess) {
      return updatedAccess;
    }
    throw new AccessNotFoundException(id);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteAccess(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(UserLimit, id);
    if (!deleteResponse.affected) {
      throw new AccessNotFoundException(id);
    }
  }
}
