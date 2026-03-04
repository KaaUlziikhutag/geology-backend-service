import { Injectable } from '@nestjs/common';
import { CreateAppStageByUserDto } from './dto/create-app-stage-byuser.dto';
import { UpdateAppStageByUserDto } from './dto/update-app-stage-byuser.dto';
import { GetAppStageByUserDto } from './dto/get-app-stage-byuser.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import AppStageByUser from './app-stage-byuser.entity';
import AppStageByUserNotFoundException from './exceptions/app-stage-byuser-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/users/interface/user.interface';

@Injectable()
export class AppStageByUserService {
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
   * A method that fetches the AppStageByUser from the database
   * @returns A promise with the list of AppStageByUsers
   */
  async getAllAppStageByUsers(query: GetAppStageByUserDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<AppStageByUser>['where'] = {};
    if (query.appId) {
      where.appId = Equal(query.appId);
    }
    if (query.autorId) {
      where.autorId = Equal(query.autorId);
    }
    const skip = (query.page - 1) * query.limit;

    const [items, count] = await entityManager.findAndCount(AppStageByUser, {
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
   * A method that fetches a AppStageByUser with a given id. Example:
   *
   * @example
   * const AppStageByUser = await AppStageByUserService.getAppStageByUserById(1);
   */
  async getAppStageByUserById(
    appStageByUserId: number,
    user: IUser,
  ): Promise<AppStageByUser> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const appStageByUser = await entityManager.findOne(AppStageByUser, {
      where: { id: appStageByUserId },
    });
    if (appStageByUser) {
      return appStageByUser;
    }
    throw new AppStageByUserNotFoundException(appStageByUserId);
  }

  /**
   *
   * @param AppStageByUser createAppStageByUser
   *
   */
  async createAppStageByUser(
    appStageByUser: CreateAppStageByUserDto,
    user: IUser,
  ) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newAppStageByUser = entityManager.create(
      AppStageByUser,
      appStageByUser,
    );
    await entityManager.save(newAppStageByUser);
    return newAppStageByUser;
  }

  /**
   * See the [definition of the UpdateAppStageByUserDto file]{@link UpdateAppStageByUserDto} to see a list of required properties
   */
  async updateAppStageByUser(
    id: number,
    user: IUser,
    appStageByUser: UpdateAppStageByUserDto,
  ): Promise<AppStageByUser> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(AppStageByUser, id, appStageByUser);
    const updatedAppStageByUser = await entityManager.findOne(AppStageByUser, {
      where: { id: id },
    });
    if (updatedAppStageByUser) {
      return updatedAppStageByUser;
    }
    throw new AppStageByUserNotFoundException(id);
  }

  /**
   * @deprecated Use deleteAppStageByUser instead
   */
  async deleteAppStageByUserById(id: number, user: IUser): Promise<void> {
    return this.deleteAppStageByUser(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteAppStageByUser(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(AppStageByUser, id);
    if (!deleteResponse.affected) {
      throw new AppStageByUserNotFoundException(id);
    }
  }
}
