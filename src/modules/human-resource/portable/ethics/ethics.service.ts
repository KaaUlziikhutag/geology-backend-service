import { Injectable } from '@nestjs/common';
import { CreateEthicDto } from './dto/create-ethics.dto';
import { UpdateEthicDto } from './dto/update-ethics.dto';
import { GetEthicDto } from './dto/get-ethics.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Ethics from './ethics.entity';
import EthicNotFoundException from './exceptions/ethics-not-found.exception';
import { PageDto } from '../../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../cloud/user/dto/get-user.dto';

@Injectable()
export class EthicService {
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
   * A method that fetches the Ethic from the database
   * @returns A promise with the list of Ethics
   */
  async getAllEthics(query: GetEthicDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Ethics>['where'] = {};
    if (query.workerId) {
      where.workerId = Equal(query.workerId);
    }
    if (query.authorId) {
      where.authorId = Equal(query.authorId);
    }
    const page =
      query.page && !isNaN(query.page) && query.page > 0
        ? Number(query.page)
        : 1;
    const limit =
      query.limit && !isNaN(query.limit) && query.limit > 0
        ? Number(query.limit)
        : 10;

    const skip = (page - 1) * limit;
    const [items, count] = await entityManager.findAndCount(Ethics, {
      where,
      order: {
        createdAt: 'DESC',
      },
      skip: skip,
      take: limit,
    });
    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a Ethic with a given id. Example:
   *
   * @example
   * const Ethic = await EthicService.getEthicById(1);
   */
  async getEthicById(ethicId: number, user: GetUserDto): Promise<Ethics> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const ethic = await entityManager.findOne(Ethics, {
      where: { id: ethicId },
    });
    if (ethic) {
      return ethic;
    }
    throw new EthicNotFoundException(ethicId);
  }

  /**
   *
   * @param Ethic createEthic
   *
   */
  async createEthic(ethic: CreateEthicDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    ethic.authorId = user.workerId;
    const newEthic = entityManager.create(Ethics, ethic);
    await entityManager.save(newEthic);
    return newEthic;
  }

  /**
   * See the [definition of the UpdateEthicDto file]{@link UpdateEthicDto} to see a list of required properties
   */
  async updateEthic(
    id: number,
    user: GetUserDto,
    ethic: UpdateEthicDto,
  ): Promise<Ethics> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Ethics, id, ethic);
    const updatedEthic = await entityManager.findOne(Ethics, {
      where: { id: id },
    });
    if (updatedEthic) {
      return updatedEthic;
    }
    throw new EthicNotFoundException(id);
  }

  /**
   * @deprecated Use deleteEthic instead
   */
  async deleteEthicById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteEthic(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteEthic(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Ethics, id);
    if (!deleteResponse.affected) {
      throw new EthicNotFoundException(id);
    }
  }
}
