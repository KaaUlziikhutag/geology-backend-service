import { Injectable } from '@nestjs/common';
import { CreateDelayHumanDto } from './dto/create-delay-human.dto';
import { UpdateDelayHumanDto } from './dto/update-delay-human.dto';
import { GetDelayHumanDto } from './dto/get-delay-human.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import DelayHumans from './delay-human.entity';
import DelayHumanNotFoundException from './exceptions/delay-human-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class DelayHumanService {
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
   * A method that fetches the DelayHuman from the database
   * @returns A promise with the list of DelayHumans
   */
  async getAllDelayHumans(query: GetDelayHumanDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<DelayHumans>['where'] = {};
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    if (query.itemId) {
      where.itemId = Equal(query.itemId);
    }
    const skip = (query.page - 1) * query.limit;

    const [items, count] = await entityManager.findAndCount(DelayHumans, {
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
   * A method that fetches a DelayHuman with a given id. Example:
   *
   * @example
   * const DelayHuman = await DelayHumanService.getDelayHumanById(1);
   */
  async getDelayHumanById(
    delayHumanId: number,
    user: IUser,
  ): Promise<DelayHumans> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const delayHuman = await entityManager.findOne(DelayHumans, {
      where: { id: delayHumanId },
    });
    if (delayHuman) {
      return delayHuman;
    }
    throw new DelayHumanNotFoundException(delayHumanId);
  }

  /**
   *
   * @param DelayHuman createDelayHuman
   *
   */
  async createDelayHuman(delayHuman: CreateDelayHumanDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newDelayHuman = entityManager.create(DelayHumans, delayHuman);
    await entityManager.save(newDelayHuman);
    return newDelayHuman;
  }

  /**
   * See the [definition of the UpdateDelayHumanDto file]{@link UpdateDelayHumanDto} to see a list of required properties
   */
  async updateDelayHuman(
    id: number,
    user: IUser,
    delayHuman: UpdateDelayHumanDto,
  ): Promise<DelayHumans> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(DelayHumans, id, delayHuman);
    const updatedDelayHuman = await entityManager.findOne(DelayHumans, {
      where: { id: id },
    });
    if (updatedDelayHuman) {
      return updatedDelayHuman;
    }
    throw new DelayHumanNotFoundException(id);
  }

  /**
   * @deprecated Use deleteDelayHuman instead
   */
  async deleteDelayHumanById(id: number, user: IUser): Promise<void> {
    return this.deleteDelayHuman(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteDelayHuman(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(DelayHumans, id);
    if (!deleteResponse.affected) {
      throw new DelayHumanNotFoundException(id);
    }
  }
}
