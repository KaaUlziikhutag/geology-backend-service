import { Injectable } from '@nestjs/common';
import { CreateAppDeclareDto } from './dto/create-app-declare.dto';
import { UpdateAppDeclareDto } from './dto/update-app-declare.dto';
import { GetAppDeclareDto } from './dto/get-app-declare.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import AppDeclare from './app-declare.entity';
import AppDeclareNotFoundException from './exceptions/app-declare-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/users/interface/user.interface';

@Injectable()
export class AppDeclareService {
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
   * A method that fetches the AppDeclare from the database
   * @returns A promise with the list of AppDeclares
   */
  async getAllAppDeclares(query: GetAppDeclareDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<AppDeclare>['where'] = {};
    if (query.appId) {
      where.appId = Equal(query.appId);
    }
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    const skip = (query.page - 1) * query.limit;

    const [items, count] = await entityManager.findAndCount(AppDeclare, {
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
   * A method that fetches a AppDeclare with a given id. Example:
   *
   * @example
   * const AppDeclare = await AppDeclareService.getAppDeclareById(1);
   */
  async getAppDeclareById(
    appDeclareId: number,
    user: IUser,
  ): Promise<AppDeclare> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const appDeclare = await entityManager.findOne(AppDeclare, {
      where: { id: appDeclareId },
    });
    if (appDeclare) {
      return appDeclare;
    }
    throw new AppDeclareNotFoundException(appDeclareId);
  }

  /**
   *
   * @param appDeclare createAppDeclare
   *
   */
  async createAppDeclare(appDeclare: CreateAppDeclareDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newAppDeclare = entityManager.create(AppDeclare, appDeclare);
    await entityManager.save(newAppDeclare);
    return newAppDeclare;
  }

  /**
   * See the [definition of the UpdateAppDeclareDto file]{@link UpdateAppDeclareDto} to see a list of required properties
   */
  async updateAppDeclare(
    id: number,
    user: IUser,
    appDeclare: UpdateAppDeclareDto,
  ): Promise<AppDeclare> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(AppDeclare, id, appDeclare);
    const updatedAppDeclare = await entityManager.findOne(AppDeclare, {
      where: { id: id },
    });
    if (updatedAppDeclare) {
      return updatedAppDeclare;
    }
    throw new AppDeclareNotFoundException(id);
  }

  /**
   * @deprecated Use deleteAppDeclare instead
   */
  async deleteAppDeclareById(id: number, user: IUser): Promise<void> {
    return this.deleteAppDeclare(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteAppDeclare(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(AppDeclare, id);
    if (!deleteResponse.affected) {
      throw new AppDeclareNotFoundException(id);
    }
  }
}
