import { Injectable } from '@nestjs/common';
import { CreateCelebratoryDto } from './dto/create-celebratory.dto';
import { UpdateCelebratoryDto } from './dto/update-celebratory.dto';
import { GetCelebratoryDto } from './dto/get-celebratory.dto';
import { Between, EntityManager, Equal, FindManyOptions, ILike } from 'typeorm';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import Celebratory from './celebratory.entity';
import CelebratoryNotFoundException from './exceptions/celebratory-not-found.exception';
import { IUser } from '@modules/users/interface/user.interface';

@Injectable()
export class CelebratoryService {
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
   * A method that fetches the Option from the database
   * @returns A promise with the list of Options
   */
  async getAllCelebratory(query: GetCelebratoryDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Celebratory>['where'] = {};
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    if (query.search) {
      where.name = ILike(`%${query.search}%`);
    }
    if (query.currentAt) {
      const currentDate = new Date(query.currentAt);
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
      );
      ((where.isCelebratory = Equal(false)),
        (where.startDate = Between(startOfMonth, endOfMonth)));
    }

    const allCelebratory = await entityManager.find(Celebratory, {
      where: { isCelebratory: true },
    });
    const targetMonth = new Date(query.currentAt).getMonth();
    const isCelebratoryTrue = allCelebratory.filter((item) => {
      const itemMonth = new Date(item.startDate).getMonth();
      return itemMonth === targetMonth;
    });
    const page =
      query.page && !isNaN(query.page) && query.page > 0
        ? Number(query.page)
        : 1;
    const limit =
      query.limit && !isNaN(query.limit) && query.limit > 0
        ? Number(query.limit)
        : 10;
    const skip = (page - 1) * limit;
    const [items, count] = await entityManager.findAndCount(Celebratory, {
      where,
      order: {
        createdAt: 'DESC',
      },
      skip: skip,
      take: limit,
    });
    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto([...items, ...isCelebratoryTrue], pageMetaDto);
  }

  /**
   * A method that fetches a Option with a given id. Example:
   *
   * @example
   * const Option = await OptionService.getOptionById(1);
   */
  async getCelebratoryById(
    celebratoryId: number,
    user: IUser,
  ): Promise<Celebratory> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const option = await entityManager.findOne(Celebratory, {
      where: { id: celebratoryId },
    });
    if (option) {
      return option;
    }
    throw new CelebratoryNotFoundException(celebratoryId);
  }

  /**
   *
   * @param Option createOption
   *
   */
  async createCelebratory(celebratory: CreateCelebratoryDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    celebratory.endDate = new Date(celebratory.startDate);
    celebratory.endDate.setDate(
      celebratory.endDate.getDate() + celebratory.duration,
    );
    const newOption = entityManager.create(Celebratory, celebratory);
    await entityManager.save(newOption);
    return newOption;
  }

  /**
   * See the [definition of the UpdateOptionDto file]{@link UpdateOptionDto} to see a list of required properties
   */
  async updateCelebratory(
    celebratoryId: number,
    user: IUser,
    celebratory: UpdateCelebratoryDto,
  ): Promise<Celebratory> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    celebratory.endDate = new Date(celebratory.startDate);
    celebratory.endDate.setDate(
      celebratory.endDate.getDate() + celebratory.duration,
    );
    await entityManager.update(Celebratory, celebratoryId, celebratory);
    const updatedCelebratory = await entityManager.findOne(Celebratory, {
      where: { id: celebratoryId },
    });
    if (updatedCelebratory) {
      return updatedCelebratory;
    }
    throw new CelebratoryNotFoundException(celebratoryId);
  }

  /**
   * @deprecated Use deleteOption instead
   */
  async deleteCelebratoryById(id: number, user: IUser): Promise<void> {
    return this.deleteCelebratory(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteCelebratory(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(Celebratory, id);
    if (!deleteResponse.affected) {
      throw new CelebratoryNotFoundException(id);
    }
  }
}
