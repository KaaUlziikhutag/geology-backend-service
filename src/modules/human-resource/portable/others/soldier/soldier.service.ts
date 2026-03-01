import { Injectable } from '@nestjs/common';
import { CreateSoldiersDto } from './dto/create-soldier.dto';
import { UpdateSoldiersDto } from './dto/update-soldier.dto';
import { GetSoldiersDto } from './dto/get-soldier.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Soldiers from './soldier.entity';
import SoldiersNotFoundException from './exceptions/soldier-not-found.exception';
import { PageDto } from '../../../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../../cloud/user/dto/get-user.dto';

@Injectable()
export class SoldiersService {
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
   * A method that fetches the Soldiers from the database
   * @returns A promise with the list of Soldierss
   */
  async getAllSoldierss(query: GetSoldiersDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Soldiers>['where'] = {};
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    if (query.workerId) {
      where.workerId = Equal(query.workerId);
    }
    const [items, count] = await entityManager.findAndCount(Soldiers, {
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
   * A method that fetches a Soldiers with a given id. Example:
   *
   * @example
   * const Soldiers = await SoldiersService.getSoldiersById(1);
   */
  async getSoldiersById(
    soldiersId: number,
    user: GetUserDto,
  ): Promise<Soldiers> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const soldiers = await entityManager.findOne(Soldiers, {
      where: { id: soldiersId },
    });
    if (soldiers) {
      return soldiers;
    }
    throw new SoldiersNotFoundException(soldiersId);
  }

  /**
   *
   * @param Soldiers createSoldiers
   *
   */
  async createSoldiers(soldiers: CreateSoldiersDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    soldiers.authorId = user.workerId;
    const newSoldiers = entityManager.create(Soldiers, soldiers);
    await entityManager.save(newSoldiers);
    return newSoldiers;
  }

  /**
   * See the [definition of the UpdateSoldiersDto file]{@link UpdateSoldiersDto} to see a list of required properties
   */
  async updateSoldiers(
    id: number,
    user: GetUserDto,
    soldiers: UpdateSoldiersDto,
  ): Promise<Soldiers> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Soldiers, id, soldiers);
    const updatedSoldiers = await entityManager.findOne(Soldiers, {
      where: { id: id },
    });
    if (updatedSoldiers) {
      return updatedSoldiers;
    }
    throw new SoldiersNotFoundException(id);
  }

  /**
   * @deprecated Use deleteSoldiers instead
   */
  async deleteSoldiersById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteSoldiers(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteSoldiers(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Soldiers, id);
    if (!deleteResponse.affected) {
      throw new SoldiersNotFoundException(id);
    }
  }
}
