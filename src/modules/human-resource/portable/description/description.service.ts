import { Injectable } from '@nestjs/common';
import { CreateDescriptionDto } from './dto/create-description.dto';
import { UpdateDescriptionDto } from './dto/update-description.dto';
import { GetDescriptionDto } from './dto/get-description.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Descriptions from './description.entity';
import DescriptionNotFoundException from './exceptions/description-not-found.exception';
import { PageDto } from '../../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../cloud/user/dto/get-user.dto';

@Injectable()
export class DescriptionService {
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
   * A method that fetches the Description from the database
   * @returns A promise with the list of Descriptions
   */
  async getAllDescriptions(query: GetDescriptionDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Descriptions>['where'] = {};
    if (query.authorId) {
      where.authorId = Equal(query.authorId);
    }
    if (query.userId) {
      where.userId = Equal(query.userId);
    }
    if (query.appId) {
      where.appId = Equal(query.appId);
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

    const [items, count] = await entityManager.findAndCount(Descriptions, {
      where,
      order: {
        createdAt: 'DESC',
      },
      relations: ['appTree'],
      skip,
      take: limit,
    });

    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a Description with a given id. Example:
   *
   * @example
   * const Description = await DescriptionService.getDescriptionById(1);
   */
  async getDescriptionById(
    descriptionId: number,
    user: GetUserDto,
  ): Promise<Descriptions> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const description = await entityManager.findOne(Descriptions, {
      where: { id: descriptionId },
      relations: ['appTree'],
    });
    if (description) {
      return description;
    }
    throw new DescriptionNotFoundException(descriptionId);
  }

  /**
   *
   * @param Description createDescription
   *
   */
  async createDescription(description: CreateDescriptionDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    description.authorId = user.workerId;
    const newDescription = entityManager.create(Descriptions, description);
    await entityManager.save(newDescription);
    return newDescription;
  }

  /**
   * See the [definition of the UpdateDescriptionDto file]{@link UpdateDescriptionDto} to see a list of required properties
   */
  async updateDescription(
    id: number,
    user: GetUserDto,
    description: UpdateDescriptionDto,
  ): Promise<Descriptions> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Descriptions, id, description);
    const updatedDescription = await entityManager.findOne(Descriptions, {
      where: { id: id },
    });
    if (updatedDescription) {
      return updatedDescription;
    }
    throw new DescriptionNotFoundException(id);
  }

  /**
   * @deprecated Use deleteDescription instead
   */
  async deleteDescriptionById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteDescription(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteDescription(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Descriptions, id);
    if (!deleteResponse.affected) {
      throw new DescriptionNotFoundException(id);
    }
  }
}
