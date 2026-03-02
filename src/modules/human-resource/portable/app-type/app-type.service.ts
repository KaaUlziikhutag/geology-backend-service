import { Injectable } from '@nestjs/common';
import { CreateAppTypeDto } from './dto/create-app-type.dto';
import { UpdateAppTypeDto } from './dto/update-app-type.dto';
import { GetAppTypeDto } from './dto/get-app-type.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import AppType from './app-type.entity';
import AppTypeNotFoundException from './exceptions/app-type-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class AppTypeService {
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
   * A method that fetches the AppType from the database
   * @returns A promise with the list of AppTypes
   */
  async getAllAppTypes(query: GetAppTypeDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<AppType>['where'] = {};
    if (query.autorId) {
      where.autorId = Equal(query.autorId);
    }
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    const skip = (query.page - 1) * query.limit;

    const [items, count] = await entityManager.findAndCount(AppType, {
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
   * A method that fetches a AppType with a given id. Example:
   *
   * @example
   * const AppType = await AppTypeService.getAppTypeById(1);
   */
  async getAppTypeById(appTypeId: number, user: IUser): Promise<AppType> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const appType = await entityManager.findOne(AppType, {
      where: { id: appTypeId },
    });
    if (appType) {
      return appType;
    }
    throw new AppTypeNotFoundException(appTypeId);
  }

  /**
   *
   * @param appType createAppType
   *
   */
  async createAppType(appType: CreateAppTypeDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newAppType = entityManager.create(AppType, appType);
    await entityManager.save(newAppType);
    return newAppType;
  }

  /**
   * See the [definition of the UpdateAppTypeDto file]{@link UpdateAppTypeDto} to see a list of required properties
   */
  async updateAppType(
    id: number,
    user: IUser,
    appType: UpdateAppTypeDto,
  ): Promise<AppType> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(AppType, id, appType);
    const updatedAppType = await entityManager.findOne(AppType, {
      where: { id: id },
    });
    if (updatedAppType) {
      return updatedAppType;
    }
    throw new AppTypeNotFoundException(id);
  }

  /**
   * @deprecated Use deleteAppType instead
   */
  async deleteAppTypeById(id: number, user: IUser): Promise<void> {
    return this.deleteAppType(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteAppType(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(AppType, id);
    if (!deleteResponse.affected) {
      throw new AppTypeNotFoundException(id);
    }
  }
}
