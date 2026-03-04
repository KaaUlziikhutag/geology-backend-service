import { Injectable } from '@nestjs/common';
import { CreateAppStageDto } from './dto/create-app-stage.dto';
import { UpdateAppStageDto } from './dto/update-app-stage.dto';
import { GetAppStageDto } from './dto/get-app-stage.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import AppStage from './app-stage.entity';
import AppStageNotFoundException from './exceptions/app-stage-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/users/interface/user.interface';

@Injectable()
export class AppStageService {
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
   * A method that fetches the AppStage from the database
   * @returns A promise with the list of AppStages
   */
  async getAllAppStages(query: GetAppStageDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<AppStage>['where'] = {};
    if (query.autorId) {
      where.autorId = Equal(query.autorId);
    }
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    const skip = (query.page - 1) * query.limit;

    const [items, count] = await entityManager.findAndCount(AppStage, {
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
   * A method that fetches a AppStage with a given id. Example:
   *
   * @example
   * const AppStage = await AppStageService.getAppStageById(1);
   */
  async getAppStageById(appStageId: number, user: IUser): Promise<AppStage> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const appStage = await entityManager.findOne(AppStage, {
      where: { id: appStageId },
    });
    if (appStage) {
      return appStage;
    }
    throw new AppStageNotFoundException(appStageId);
  }

  /**
   *
   * @param AppStage createAppStage
   *
   */
  async createAppStage(appStage: CreateAppStageDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newAppStage = entityManager.create(AppStage, appStage);
    await entityManager.save(newAppStage);
    return newAppStage;
  }

  /**
   * See the [definition of the UpdateAppStageDto file]{@link UpdateAppStageDto} to see a list of required properties
   */
  async updateAppStage(
    id: number,
    user: IUser,
    appStage: UpdateAppStageDto,
  ): Promise<AppStage> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(AppStage, id, appStage);
    const updatedAppStage = await entityManager.findOne(AppStage, {
      where: { id: id },
    });
    if (updatedAppStage) {
      return updatedAppStage;
    }
    throw new AppStageNotFoundException(id);
  }

  /**
   * @deprecated Use deleteAppStage instead
   */
  async deleteAppStageById(id: number, user: IUser): Promise<void> {
    return this.deleteAppStage(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteAppStage(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(AppStage, id);
    if (!deleteResponse.affected) {
      throw new AppStageNotFoundException(id);
    }
  }
}
