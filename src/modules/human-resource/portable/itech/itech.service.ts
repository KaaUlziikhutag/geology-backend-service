import { Injectable } from '@nestjs/common';
import { CreateItechDto } from './dto/create-itech.dto';
import { UpdateItechDto } from './dto/update-itech.dto';
import { GetItechDto } from './dto/get-itech.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Itechs from './itech.entity';
import ItechNotFoundException from './exceptions/itech-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class ItechService {
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
   * A method that fetches the Itech from the database
   * @returns A promise with the list of Itechs
   */
  async getAllItechs(query: GetItechDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Itechs>['where'] = {};

    if (query.itechType) {
      where.itechType = Equal(query.itechType);
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

    const [items, count] = await entityManager.findAndCount(Itechs, {
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
   * A method that fetches a Itech with a given id. Example:
   *
   * @example
   * const Itech = await ItechService.getItechById(1);
   */
  async getItechById(itechId: number, user: IUser): Promise<Itechs> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const itech = await entityManager.findOne(Itechs, {
      where: { id: itechId },
    });
    if (itech) {
      return itech;
    }
    throw new ItechNotFoundException(itechId);
  }

  /**
   *
   * @param Itech createItech
   *
   */
  async createItech(itech: CreateItechDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    itech.authorId = user.id;
    const newItech = entityManager.create(Itechs, itech);
    await entityManager.save(newItech);
    return newItech;
  }

  /**
   * See the [definition of the UpdateItechDto file]{@link UpdateItechDto} to see a list of required properties
   */
  async updateItech(
    id: number,
    user: IUser,
    itech: UpdateItechDto,
  ): Promise<Itechs> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Itechs, id, itech);
    const updatedItech = await entityManager.findOne(Itechs, {
      where: { id: id },
    });
    if (updatedItech) {
      return updatedItech;
    }
    throw new ItechNotFoundException(id);
  }

  // async updateItech(
  //   id: number,
  //   user: IUser,
  //   itech: UpdateItechDto,
  // ): Promise<Itechs> {
  //   const entityManager = await this.loadEntityManager(user.dataBase);
  //   const updateData = instanceToPlain(itech);
  //   await entityManager.update(Itechs, id, updateData);

  //   const updatedItech = await entityManager.findOne(Itechs, {
  //     where: { id: id },
  //   });

  //   if (updatedItech) {
  //     return updatedItech;
  //   }

  //   throw new ItechNotFoundException(id);
  // }

  /**
   * @deprecated Use deleteItech instead
   */
  async deleteItechById(id: number, user: IUser): Promise<void> {
    return this.deleteItech(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteItech(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Itechs, id);
    if (!deleteResponse.affected) {
      throw new ItechNotFoundException(id);
    }
  }
}
