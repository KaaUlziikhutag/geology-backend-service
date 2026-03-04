import { Injectable } from '@nestjs/common';
import { CreateAwardDto } from './dto/create-awards.dto';
import { UpdateAwardDto } from './dto/update-awards.dto';
import { GetAwardDto } from './dto/get-awards.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Awards from './awards.entity';
import AwardNotFoundException from './exceptions/awards-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/users/interface/user.interface';

@Injectable()
export class AwardService {
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
   * A method that fetches the Award from the database
   * @returns A promise with the list of Awards
   */
  async getAllAwards(query: GetAwardDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Awards>['where'] = {};
    if (query.userId) {
      where.userId = Equal(query.userId);
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
    const [items, count] = await entityManager.findAndCount(Awards, {
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
   * A method that fetches a Award with a given id. Example:
   *
   * @example
   * const Award = await AwardService.getAwardById(1);
   */
  async getAwardById(awardId: number, user: IUser): Promise<Awards> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const award = await entityManager.findOne(Awards, {
      where: { id: awardId },
    });
    if (award) {
      return award;
    }
    throw new AwardNotFoundException(awardId);
  }

  /**
   *
   * @param Award createAward
   *
   */
  async createAward(award: CreateAwardDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    award.authorId = user.id;
    const newAwards = entityManager.create(Awards, award);
    await entityManager.save(newAwards);
    return newAwards;
  }

  /*
   * See the [definition of the UpdateAwardDto file]{@link UpdateAwardDto} to see a list of required properties
   */
  async updateAward(
    id: number,
    user: IUser,
    award: UpdateAwardDto,
  ): Promise<Awards> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Awards, id, award);
    const updatedAward = await entityManager.findOne(Awards, {
      where: { id: id },
    });
    if (updatedAward) {
      return updatedAward;
    }
    throw new AwardNotFoundException(id);
  }

  /**
   * @deprecated Use deleteAward instead
   */
  async deleteAwardById(id: number, user: IUser): Promise<void> {
    return this.deleteAward(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteAward(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(Awards, id);
    if (!deleteResponse.affected) {
      throw new AwardNotFoundException(id);
    }
  }
}
