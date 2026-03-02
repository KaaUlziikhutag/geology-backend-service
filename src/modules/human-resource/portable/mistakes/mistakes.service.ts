import { Injectable } from '@nestjs/common';
import { CreateMistakesDto } from './dto/create-mistakes.dto';
import { UpdateMistakesDto } from './dto/update-mistakes.dto';
import { GetMistakesDto } from './dto/get-mistakes.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Mistakes from './mistakes.entity';
import MistakesNotFoundException from './exceptions/mistakes-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class MistakesService {
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
   * A method that fetches the Mistakes from the database
   * @returns A promise with the list of Mistakess
   */
  async getAllMistakes(query: GetMistakesDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Mistakes>['where'] = {};
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
    const [items, count] = await entityManager.findAndCount(Mistakes, {
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
   * A method that fetches a Mistakes with a given id. Example:
   *
   * @example
   * const Mistakes = await MistakesService.getMistakesById(1);
   */
  async getMistakesById(mistakesId: number, user: IUser): Promise<Mistakes> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const mistakes = await entityManager.findOne(Mistakes, {
      where: { id: mistakesId },
    });
    if (mistakes) {
      return mistakes;
    }
    throw new MistakesNotFoundException(mistakesId);
  }

  /**
   *
   * @param Mistakes createMistakes
   *
   */
  async createMistakes(mistakes: CreateMistakesDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    mistakes.authorId = user.id;
    const newMistakes = entityManager.create(Mistakes, mistakes);
    await entityManager.save(newMistakes);
    return newMistakes;
  }

  /**
   * See the [definition of the UpdateMistakesDto file]{@link UpdateMistakesDto} to see a list of required properties
   */
  async updateMistakes(
    id: number,
    user: IUser,
    mistakes: UpdateMistakesDto,
  ): Promise<Mistakes> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Mistakes, id, mistakes);
    const updatedMistakes = await entityManager.findOne(Mistakes, {
      where: { id: id },
    });
    if (updatedMistakes) {
      return updatedMistakes;
    }
    throw new MistakesNotFoundException(id);
  }

  /**
   * @deprecated Use deleteMistakes instead
   */
  async deleteMistakesById(id: number, user: IUser): Promise<void> {
    return this.deleteMistakes(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteMistakes(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Mistakes, id);
    if (!deleteResponse.affected) {
      throw new MistakesNotFoundException(id);
    }
  }
}
