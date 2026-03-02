import { Injectable } from '@nestjs/common';
import { CreateHomesDto } from './dto/create-home.dto';
import { UpdateHomesDto } from './dto/update-home.dto';
import { GetHomesDto } from './dto/get-home.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Homes from './home.entity';
import HomesNotFoundException from './exceptions/home-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class HomesService {
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
   * A method that fetches the Homes from the database
   * @returns A promise with the list of Homess
   */
  async getAllHomess(query: GetHomesDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Homes>['where'] = {};
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    if (query.workerId) {
      where.workerId = Equal(query.workerId);
    }
    const [items, count] = await entityManager.findAndCount(Homes, {
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
   * A method that fetches a Homes with a given id. Example:
   *
   * @example
   * const Homes = await HomesService.getHomesById(1);
   */
  async getHomesById(homesId: number, user: IUser): Promise<Homes> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const homes = await entityManager.findOne(Homes, {
      where: { id: homesId },
    });
    if (homes) {
      return homes;
    }
    throw new HomesNotFoundException(homesId);
  }

  /**
   *
   * @param Homes createHomes
   *
   */
  async createHomes(homes: CreateHomesDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    homes.authorId = user.id;
    const newHomes = entityManager.create(Homes, homes);
    await entityManager.save(newHomes);
    return newHomes;
  }

  /**
   * See the [definition of the UpdateHomesDto file]{@link UpdateHomesDto} to see a list of required properties
   */
  async updateHomes(
    id: number,
    user: IUser,
    homes: UpdateHomesDto,
  ): Promise<Homes> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Homes, id, homes);
    const updatedHomes = await entityManager.findOne(Homes, {
      where: { id: id },
    });
    if (updatedHomes) {
      return updatedHomes;
    }
    throw new HomesNotFoundException(id);
  }

  /**
   * @deprecated Use deleteHomes instead
   */
  async deleteHomesById(id: number, user: IUser): Promise<void> {
    return this.deleteHomes(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteHomes(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Homes, id);
    if (!deleteResponse.affected) {
      throw new HomesNotFoundException(id);
    }
  }
}
