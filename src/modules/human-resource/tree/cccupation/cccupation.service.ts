import { Injectable } from '@nestjs/common';
import { CreateoccupationDto } from './dto/create-cccupation.dto';
import { UpdateoccupationDto } from './dto/update-cccupation.dto';
import { GetOccupationDto } from './dto/get-cccupation.dto';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import Occupations from './cccupation.entity';
import occupationNotFoundException from './exceptions/cccupation-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';

import { ModuleRef } from '@nestjs/core';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class OccupationService {
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
   * A method that fetches the companies from the database
   * @returns A promise with the list of occupations
   */
  async getAllOccupations(query: GetOccupationDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const { skip, page } = query;

    const queryBuilder = entityManager
      .createQueryBuilder(Occupations, 'occupation')
      .leftJoinAndSelect('occupation.children', 'children')
      .leftJoinAndSelect('children.children', 'grandchildren')
      .orderBy('occupation.createdAt', 'ASC')
      .skip(skip);

    // Apply filter for `name` or `code` using `OR` condition
    if (query.filter) {
      queryBuilder.andWhere(
        '(occupation.name ILIKE :filter OR occupation.code ILIKE :filter)',
        { filter: `%${query.filter}%` },
      );
    }

    // Apply additional filters if provided
    if (query.type) {
      queryBuilder.andWhere('occupation.type = :type', { type: query.type });
    }

    if (query.mid) {
      queryBuilder.andWhere('occupation.mid = :mid', { mid: query.mid });
    }

    const [items, count] = await queryBuilder.getManyAndCount();

    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit: count, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  // async getAlloccupations(query: GetoccupationDto, user: IUser) {
  //   const entityManager = await this.loadEntityManager(user.dataBase);
  //   const where: FindManyOptions<Occupations>['where'] = {};
  //   const { skip, page } = query;

  //   if (query.filter) {
  //     where['name'] = ILike('%' + query.filter + '%');
  //     where['code'] = ILike('%' + query.filter + '%');
  //   }

  //   if (query.type) {
  //     where.type = Equal(query.type as JobCategory);
  //   }

  //   if (query.mid) {
  //     where.mid = Equal(query.mid);
  //   }

  //   const [items, count] = await entityManager.findAndCount(Occupations, {
  //     where,
  //     order: {
  //       createdAt: 'ASC',
  //     },
  //     relations: ['children', 'children.children'],
  //     skip: skip,
  //     // take параметрыг арилгаж бүх өгөгдлийг буцаана
  //   });

  //   const itemCount = count;
  //   const pageMetaDto = new PageMetaDto({ page, limit: count, itemCount });
  //   return new PageDto(items, pageMetaDto);
  // }

  /**
   * A method that fetches a occupation with a given id. Example:
   *
   * @example
   * const occupation = await occupationService.getoccupationById(1);
   */
  async getoccupationById(
    occupationId: number,
    user: IUser,
  ): Promise<Occupations> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const occupation = await entityManager.findOne(Occupations, {
      where: { id: occupationId },
    });
    if (occupation) {
      return occupation;
    }
    throw new occupationNotFoundException(occupationId);
  }

  /**
   *
   * @param occupation createoccupation
   *
   */
  async createoccupation(occupation: CreateoccupationDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newoccupation = entityManager.create(Occupations, occupation);
    await entityManager.save(newoccupation);
    return newoccupation;
  }

  /**
   * See the [definition of the UpdateoccupationDto file]{@link UpdateoccupationDto} to see a list of required properties
   */
  async updateoccupation(
    id: number,
    occupation: UpdateoccupationDto,
    user: IUser,
  ): Promise<Occupations> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Occupations, id, occupation);
    const updatedoccupation = await entityManager.findOne(Occupations, {
      where: { id: id },
    });
    if (updatedoccupation) {
      return updatedoccupation;
    }
    throw new occupationNotFoundException(id);
  }

  /**
   * @deprecated Use deleteoccupation instead
   */
  async deleteoccupationById(id: number, user: IUser): Promise<void> {
    return this.deleteoccupation(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteoccupation(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(Occupations, id);
    if (!deleteResponse.affected) {
      throw new occupationNotFoundException(id);
    }
  }
}
