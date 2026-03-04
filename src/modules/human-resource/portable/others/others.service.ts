import { Injectable } from '@nestjs/common';
import { CreateOthersDto } from './dto/create-others.dto';
import { UpdateOthersDto } from './dto/update-others.dto';
import { GetOthersDto } from './dto/get-others.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Others from './others.entity';
import OthersNotFoundException from './exceptions/others-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/users/interface/user.interface';

@Injectable()
export class OthersService {
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
   * A method that fetches the Others from the database
   * @returns A promise with the list of Otherss
   */
  async getAllOtherss(query: GetOthersDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Others>['where'] = {};
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    if (query.workerId) {
      where.workerId = Equal(query.workerId);
    }
    const [items, count] = await entityManager.findAndCount(Others, {
      where,
      order: {
        createdAt: 'DESC',
      },
      skip: query.skip,
      take: query.limit,
    });

    const page = Number(query.page);
    const limit = Number(query.limit);
    const itemCount = count;

    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });

    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a Others with a given id. Example:
   *
   * @example
   * const Others = await OthersService.getOthersById(1);
   */
  async getOthersById(othersId: number, user: IUser): Promise<Others> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const others = await entityManager.findOne(Others, {
      where: { id: othersId },
    });
    if (others) {
      return others;
    }
    throw new OthersNotFoundException(othersId);
  }

  /**
   *
   * @param Others createOthers
   *
   */
  async createOthers(others: CreateOthersDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    others.authorId = user.id;
    const newOthers = entityManager.create(Others, others);
    await entityManager.save(newOthers);
    return newOthers;
  }

  /**
   * See the [definition of the UpdateOthersDto file]{@link UpdateOthersDto} to see a list of required properties
   */
  async updateOthers(
    id: number,
    user: IUser,
    others: UpdateOthersDto,
  ): Promise<Others> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Others, id, others);
    const updatedOthers = await entityManager.findOne(Others, {
      where: { id: id },
    });
    if (updatedOthers) {
      return updatedOthers;
    }
    throw new OthersNotFoundException(id);
  }

  /**
   * @deprecated Use deleteOthers instead
   */
  async deleteOthersById(id: number, user: IUser): Promise<void> {
    return this.deleteOthers(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteOthers(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Others, id);
    if (!deleteResponse.affected) {
      throw new OthersNotFoundException(id);
    }
  }
}
