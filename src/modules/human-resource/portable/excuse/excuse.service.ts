import { Injectable } from '@nestjs/common';
import { CreateExcuseDto } from './dto/create-excuse.dto';
import { UpdateExcuseDto } from './dto/update-excuse.dto';
import { GetExcuseDto } from './dto/get-excuse.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Excuses from './excuse.entity';
import ExcuseNotFoundException from './exceptions/excuse-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class ExcuseService {
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
   * A method that fetches the Excuse from the database
   * @returns A promise with the list of Excuses
   */
  async getAllExcuses(query: GetExcuseDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Excuses>['where'] = {};
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    if (query.itemId) {
      where.itemId = Equal(query.itemId);
    }
    const skip = (query.page - 1) * query.limit;

    const [items, count] = await entityManager.findAndCount(Excuses, {
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
   * A method that fetches a Excuse with a given id. Example:
   *
   * @example
   * const Excuse = await ExcuseService.getExcuseById(1);
   */
  async getExcuseById(excuseId: number, user: IUser): Promise<Excuses> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const excuse = await entityManager.findOne(Excuses, {
      where: { id: excuseId },
    });
    if (excuse) {
      return excuse;
    }
    throw new ExcuseNotFoundException(excuseId);
  }

  /**
   *
   * @param Excuse createExcuse
   *
   */
  async createExcuse(excuse: CreateExcuseDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    excuse.authorId = user.id;
    const newExcuse = entityManager.create(Excuses, excuse);
    await entityManager.save(newExcuse);
    return newExcuse;
  }

  /**
   * See the [definition of the UpdateExcuseDto file]{@link UpdateExcuseDto} to see a list of required properties
   */
  async updateExcuse(
    id: number,
    user: IUser,
    excuse: UpdateExcuseDto,
  ): Promise<Excuses> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Excuses, id, excuse);
    const updatedExcuse = await entityManager.findOne(Excuses, {
      where: { id: id },
    });
    if (updatedExcuse) {
      return updatedExcuse;
    }
    throw new ExcuseNotFoundException(id);
  }

  /**
   * @deprecated Use deleteExcuse instead
   */
  async deleteExcuseById(id: number, user: IUser): Promise<void> {
    return this.deleteExcuse(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteExcuse(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Excuses, id);
    if (!deleteResponse.affected) {
      throw new ExcuseNotFoundException(id);
    }
  }
}
