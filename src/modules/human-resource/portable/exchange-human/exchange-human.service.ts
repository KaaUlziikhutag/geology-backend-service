import { Injectable } from '@nestjs/common';
import { CreateExchangeHumanDto } from './dto/create-exchange-human.dto';
import { UpdateExchangeHumanDto } from './dto/update-exchange-human.dto';
import { GetExchangeHumanDto } from './dto/get-exchange-human.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import ExchangeHumans from './exchange-human.entity';
import ExchangeHumanNotFoundException from './exceptions/exchange-human-not-found.exception';
import { PageDto } from '../../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../cloud/user/dto/get-user.dto';

@Injectable()
export class ExchangeHumanService {
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
   * A method that fetches the ExchangeHuman from the database
   * @returns A promise with the list of ExchangeHumans
   */
  async getAllExchangeHumans(query: GetExchangeHumanDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<ExchangeHumans>['where'] = {};
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    if (query.itemId) {
      where.itemId = Equal(query.itemId);
    }
    const skip = (query.page - 1) * query.limit;

    const [items, count] = await entityManager.findAndCount(ExchangeHumans, {
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
   * A method that fetches a ExchangeHuman with a given id. Example:
   *
   * @example
   * const ExchangeHuman = await ExchangeHumanService.getExchangeHumanById(1);
   */
  async getExchangeHumanById(
    exchangeHumanId: number,
    user: GetUserDto,
  ): Promise<ExchangeHumans> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const exchangeHuman = await entityManager.findOne(ExchangeHumans, {
      where: { id: exchangeHumanId },
    });
    if (exchangeHuman) {
      return exchangeHuman;
    }
    throw new ExchangeHumanNotFoundException(exchangeHumanId);
  }

  /**
   *
   * @param ExchangeHuman createExchangeHuman
   *
   */
  async createExchangeHuman(
    exchangeHuman: CreateExchangeHumanDto,
    user: GetUserDto,
  ) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newExchangeHuman = entityManager.create(
      ExchangeHumans,
      exchangeHuman,
    );
    await entityManager.save(newExchangeHuman);
    return newExchangeHuman;
  }

  /**
   * See the [definition of the UpdateExchangeHumanDto file]{@link UpdateExchangeHumanDto} to see a list of required properties
   */
  async updateExchangeHuman(
    id: number,
    user: GetUserDto,
    exchangeHuman: UpdateExchangeHumanDto,
  ): Promise<ExchangeHumans> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(ExchangeHumans, id, exchangeHuman);
    const updatedExchangeHuman = await entityManager.findOne(ExchangeHumans, {
      where: { id: id },
    });
    if (updatedExchangeHuman) {
      return updatedExchangeHuman;
    }
    throw new ExchangeHumanNotFoundException(id);
  }

  /**
   * @deprecated Use deleteExchangeHuman instead
   */
  async deleteExchangeHumanById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteExchangeHuman(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteExchangeHuman(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(ExchangeHumans, id);
    if (!deleteResponse.affected) {
      throw new ExchangeHumanNotFoundException(id);
    }
  }
}
