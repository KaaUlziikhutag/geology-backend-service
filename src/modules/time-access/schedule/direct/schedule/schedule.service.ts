import { Injectable } from '@nestjs/common';
import { CreateDirectScheduleDto } from './dto/create-schedule.dto';
import { UpdateDirectScheduleDto } from './dto/update-schedule.dto';
import { GetDirectScheduleDto } from './dto/get-schedule.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import DirectSchedules from './schedule.entity';
import DirectScheduleNotFoundException from './exceptions/schedule-not-found.exception';
import { PageDto } from '../../../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../../cloud/user/dto/get-user.dto';
import Directs from '../entities/direct.entity';
import { calculateAttendanceStatus } from '../../../../../utils/dateUtils';
import { ScheduleStatus } from '../../../../../utils/globalUtils';

@Injectable()
export class DirectScheduleService {
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
   * A method that fetches the DirectSchedule from the database
   * @returns A promise with the list of DirectSchedules
   */
  async getAllDirectSchedules(query: GetDirectScheduleDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<DirectSchedules>['where'] = {};
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
    const [items, count] = await entityManager.findAndCount(DirectSchedules, {
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
   * A method that fetches a DirectSchedule with a given id. Example:
   *
   * @example
   * const DirectSchedule = await DirectScheduleService.getDirectScheduleById(1);
   */
  async getDirectScheduleById(
    directScheduleId: number,
    user: GetUserDto,
  ): Promise<DirectSchedules> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const directSchedule = await entityManager.findOne(DirectSchedules, {
      where: { id: directScheduleId },
    });
    if (directSchedule) {
      return directSchedule;
    }
    throw new DirectScheduleNotFoundException(directScheduleId);
  }

  /**
   *
   * @param DirectSchedule createDirectSchedule
   *
   */
  async createDirectSchedule(
    directSchedule: CreateDirectScheduleDto,
    user: GetUserDto,
  ) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newDirectSchedule = entityManager.create(
      DirectSchedules,
      directSchedule,
    );
    await entityManager.save(newDirectSchedule);
    return newDirectSchedule;
  }

  async createDirectScheduleCron(direct: Directs, database: string) {
    try {
      const entityManager = await this.loadEntityManager(database);
      if (!direct || !Array.isArray(direct.viewUsers)) {
        return direct;
      }
      const createdSchedules = [];
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const endDate = direct.endDate
        ? new Date(direct.endDate)
        : new Date(Date.UTC(today.getUTCFullYear(), 11, 31));
      endDate.setUTCHours(0, 0, 0, 0);
      const mainSchedulesByDay = {};
      for (const ms of direct.mainSchedules) {
        mainSchedulesByDay[Number(ms.day)] = ms;
      }
      for (
        let currentDate = new Date(today);
        currentDate <= endDate;
        currentDate.setUTCDate(currentDate.getUTCDate() + 1)
      ) {
        const scheduleDate = new Date(currentDate);
        const jsDay = scheduleDate.getUTCDay();
        const day = jsDay === 0 ? 7 : jsDay;
        const scheduleForDay = mainSchedulesByDay[day];
        if (!scheduleForDay) continue;
        const isWork = !!(scheduleForDay.time1 && scheduleForDay.time4);
        for (const viewUser of direct.viewUsers) {
          const viewUserId = viewUser.userId;
          const exists = await entityManager.findOne(DirectSchedules, {
            where: {
              directId: direct.id, // direct.id гэж өөрчлөнө
              userId: viewUserId,
              date: scheduleDate,
            },
          });
          if (exists) continue;
          const newSchedule = entityManager.create(DirectSchedules, {
            directId: direct.id, // direct.id гэж өөрчлөнө
            date: scheduleDate,
            day,
            userId: viewUserId,
            startTime: scheduleForDay.time1,
            endTime: scheduleForDay.time4,
            isWork,
          });
          const savedSchedule = await entityManager.save(newSchedule);
          createdSchedules.push(savedSchedule);
        }
      }
      return createdSchedules;
    } catch (error) {
      console.error('Error in createDirectScheduleCron:', error);
      throw error;
    }
  }

  /**
   * See the [definition of the UpdateDirectScheduleDto file]{@link UpdateDirectScheduleDto} to see a list of required properties
   */
  async updateDirectSchedule(
    id: number,
    user: GetUserDto,
    directSchedule: UpdateDirectScheduleDto,
  ): Promise<DirectSchedules> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const schedule = await entityManager.findOne(DirectSchedules, {
      where: { id },
      select: ['startTime', 'endTime'],
    });
    const attendance = calculateAttendanceStatus(
      directSchedule.time1,
      directSchedule.time2,
      schedule.startTime,
      schedule.endTime,
    );
    const updateData = {
      ...directSchedule,
      lostTime1: attendance.lostTime1,
      lostTime2: attendance.lostTime2,
      overTime1: attendance.overTime1,
      overTime2: attendance.overTime2,
      isAbsent: attendance.isAbsent,
      scheduleStatus: attendance.isAbsent
        ? ScheduleStatus.OnLeave
        : ScheduleStatus.Ongoing,
    };
    await entityManager.update(DirectSchedules, id, updateData);
    const updatedDirectSchedule = await entityManager.findOne(DirectSchedules, {
      where: { id: id },
    });
    if (updatedDirectSchedule) {
      return updatedDirectSchedule;
    }
    throw new DirectScheduleNotFoundException(id);
  }

  /**
   * @deprecated Use deleteDirectSchedule instead
   */
  async deleteDirectScheduleById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteDirectSchedule(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteDirectSchedule(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(DirectSchedules, id);
    if (!deleteResponse.affected) {
      throw new DirectScheduleNotFoundException(id);
    }
  }
}
