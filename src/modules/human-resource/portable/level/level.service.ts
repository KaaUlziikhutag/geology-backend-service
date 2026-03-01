import { Injectable } from '@nestjs/common';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { GetLevelDto } from './dto/get-level.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Levels from './level.entity';
import LevelNotFoundException from './exceptions/level-not-found.exception';
import { PageDto } from '../../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../cloud/user/dto/get-user.dto';

@Injectable()
export class LevelService {
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
   * A method that fetches the Level from the database
   * @returns A promise with the list of Levels
   */
  async getAllLevels(query: GetLevelDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Levels>['where'] = {};
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    if (query.itemId) {
      where.itemId = Equal(query.itemId);
    }
    const skip = (query.page - 1) * query.limit;

    const [items, count] = await entityManager.findAndCount(Levels, {
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
   * A method that fetches a Level with a given id. Example:
   *
   * @example
   * const Level = await LevelService.getLevelById(1);
   */
  async getLevelById(levelId: number, user: GetUserDto): Promise<Levels> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const level = await entityManager.findOne(Levels, {
      where: { id: levelId },
    });
    if (level) {
      return level;
    }
    throw new LevelNotFoundException(levelId);
  }

  /**
   *
   * @param level createLevel
   *
   */
  async createLevel(level: CreateLevelDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    level.authorId = user.workerId;
    const newLevel = entityManager.create(Levels, level);
    await entityManager.save(newLevel);
    return newLevel;
  }

  /**
   * See the [definition of the UpdateLevelDto file]{@link UpdateLevelDto} to see a list of required properties
   */
  async updateLevel(
    id: number,
    user: GetUserDto,
    level: UpdateLevelDto,
  ): Promise<Levels> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Levels, id, level);
    const updatedLevel = await entityManager.findOne(Levels, {
      where: { id: id },
    });
    if (updatedLevel) {
      return updatedLevel;
    }
    throw new LevelNotFoundException(id);
  }

  /**
   * @deprecated Use deleteLevel instead
   */
  async deleteLevelById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteLevel(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteLevel(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Levels, id);
    if (!deleteResponse.affected) {
      throw new LevelNotFoundException(id);
    }
  }
}
