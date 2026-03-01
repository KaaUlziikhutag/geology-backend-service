import { Injectable } from '@nestjs/common';
import { CreateMainScheduleDto } from './dto/create-main-schedule.dto';
import { UpdateMainScheduleDto } from './dto/update-main-schedule.dto';
import { GetMainScheduleDto } from './dto/get-main-schedule.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import MainSchedules from './main-schedule.entity';
import MainScheduleNotFoundException from './exceptions/main-schedule-not-found.exception';
import { PageDto } from '../../../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../../cloud/user/dto/get-user.dto';

@Injectable()
export class MainScheduleService {
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
   * A method that fetches the MainSchedule from the database
   * @returns A promise with the list of MainSchedules
   */
  async getAllMainSchedules(query: GetMainScheduleDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<MainSchedules>['where'] = {};
    if (query.directId) {
      where.directId = Equal(query.directId);
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
    const [items, count] = await entityManager.findAndCount(MainSchedules, {
      where,
      order: {
        day: 'DESC',
      },
      skip: skip,
      take: limit,
    });
    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a MainSchedule with a given id. Example:
   *
   * @example
   * const MainSchedule = await MainScheduleService.getMainScheduleById(1);
   */
  async getMainScheduleById(
    mainScheduleId: number,
    user: GetUserDto,
  ): Promise<MainSchedules> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const mainSchedule = await entityManager.findOne(MainSchedules, {
      where: { id: mainScheduleId },
    });
    if (mainSchedule) {
      return mainSchedule;
    }
    throw new MainScheduleNotFoundException(mainScheduleId);
  }

  /**
   *
   * @param MainSchedule createMainSchedule
   *
   */
  async createMainSchedule(
    mainSchedule: CreateMainScheduleDto,
    user: GetUserDto,
  ) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newMainSchedule = entityManager.create(MainSchedules, mainSchedule);
    await entityManager.save(newMainSchedule);
    return newMainSchedule;
  }

  /**
   * See the [definition of the UpdateMainScheduleDto file]{@link UpdateMainScheduleDto} to see a list of required properties
   */
  async updateMainSchedule(
    id: number,
    user: GetUserDto,
    mainSchedule: UpdateMainScheduleDto,
  ): Promise<MainSchedules> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(MainSchedules, id, mainSchedule);
    const updatedMainSchedule = await entityManager.findOne(MainSchedules, {
      where: { id: id },
    });
    if (updatedMainSchedule) {
      return updatedMainSchedule;
    }
    throw new MainScheduleNotFoundException(id);
  }

  /**
   * @deprecated Use deleteMainSchedule instead
   */
  async deleteMainScheduleById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteMainSchedule(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteMainSchedule(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(MainSchedules, id);
    if (!deleteResponse.affected) {
      throw new MainScheduleNotFoundException(id);
    }
  }
}
