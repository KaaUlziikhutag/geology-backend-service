import { Injectable } from '@nestjs/common';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import {
  UpdatedHolidayWithShift,
  UpdateHolidayDto,
} from './dto/update-holiday.dto';
import { GetHolidayDto } from './dto/get-holiday.dto';
import { Between, EntityManager, Equal, FindManyOptions, In } from 'typeorm';
import Holiday from './entities/holiday.entity';
import HolidayNotFoundException from './exceptions/holiday-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import HolidayByuser from './entities/holiday-byuser.entity';
import HolidayShift from './entities/holiday-shift.entity';
import Worker from '../member/worker/worker.entity';
import {
  AccessType,
  AppointmentStatusType,
  DateType,
  WorkType,
} from '@utils/enum-utils';
import Human from '../member/human/human.entity';
import HolidayClose from './entities/holiday-close.entity';
import Trees from '../tree/tree.entity';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class HolidayService {
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
   * A method that fetches the Holiday from the database
   * @returns A promise with the list of Holidays
   */
  async getAllHolidays(query: GetHolidayDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Holiday>['where'] = {};
    if (query.authorId) {
      where.authorId = Equal(query.authorId);
    }

    if (query.depId || query.groupId || query.appId) {
      const findChildrenIds = async (
        parentId: number,
        collectedIds: number[] = [],
      ): Promise<number[]> => {
        const childrens = await entityManager.find(Trees, {
          where: { mid: parentId },
        });
        const childIds = childrens.map((c) => c.id);
        if (childrens.length === 0) {
          collectedIds.push(...[parentId]);
        } else {
          for (const childId of childIds) {
            await findChildrenIds(childId, collectedIds);
          }
        }
        return collectedIds;
      };
      const id = query.depId || query.groupId || query.appId;
      const allChildIds = await findChildrenIds(id, []);
      where.treeId = In(allChildIds);
    }
    if (query.holderId) {
      where.holderId = Equal(query.holderId);
    }
    if (query.workerId) {
      where.userId = Equal(query.workerId);
    }
    if (query.holidayType) {
      where.holidayType = Equal(query.holidayType);
    }
    if (query.type == DateType.Start) {
      where.startDay = Between(query.startDate, query.endDate);
    }
    if (query.type == DateType.End) {
      where.endDay = Between(query.startDate, query.endDate);
    }
    if (query.type == DateType.Create) {
      where.createdAt = Between(query.startDate, query.endDate);
    }

    if (query.accessType == AccessType.Simple) {
      where.holidayByusers = [{ userId: Equal(user.id) }];
    }
    const page =
      query.page && !isNaN(query.page) && query.page > 0
        ? Number(query.page)
        : 1;

    let limit: number | undefined;

    if (query.limit && !isNaN(query.limit) && query.limit > 0) {
      limit = Number(query.limit);
    }
    const skip = (page - 1) * (limit || 0);
    const [items, count] = await entityManager.findAndCount(Holiday, {
      where,
      order: {
        createdAt: 'DESC',
      },
      relations: [
        'holidayByusers',
        'holidayByusers.workers',
        'holidayByusers.workers.appTree',
        'holidayByusers.workers.humans',
      ],
      skip: skip,
      take: query.limit,
    });

    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  async getAllShift(query: GetHolidayDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<HolidayShift>['where'] = {};
    if (query.authorId) {
      where.authorId = Equal(query.authorId);
    }
    if (query.itemId) {
      where.itemId = Equal(query.itemId);
    }
    if (query.groupId) {
      where.comId = Equal(query.groupId);
    }

    if (query.startDate) {
      where.createdAt = Between(query.startDate, query.endDate);
    }
    if (query.ids) {
      const id = [];
      id.push(...query.ids.split(','));
      where.id = In(id);
    }
    const page =
      query.page && !isNaN(query.page) && query.page > 0
        ? Number(query.page)
        : 1;

    let limit: number | undefined;

    if (query.limit && !isNaN(query.limit) && query.limit > 0) {
      limit = Number(query.limit);
    }
    const skip = (page - 1) * (limit || 0);
    const [items, count] = await entityManager.findAndCount(HolidayShift, {
      where,
      order: {
        createdAt: 'DESC',
      },
      skip: skip,
      take: query.limit,
    });

    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }
  /**
   * A method that fetches a Holiday with a given id. Example:
   *
   * @example
   * const Holiday = await HolidayService.getHolidayById(1);
   */
  async getHolidayById(holidayId: number, user: IUser): Promise<Holiday> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const holiday = await entityManager.findOne(Holiday, {
      where: { id: holidayId },
      relations: [
        'holidayByusers',
        'holidayByusers.workers',
        'holidayByusers.workers.appTree',
        'holidayByusers.workers.humans',
      ],
    });
    if (holiday) {
      return holiday;
    }
    throw new HolidayNotFoundException(holidayId);
  }

  /**
   *
   * @param Holiday createHoliday
   *
   */
  async createHoliday(holiday: CreateHolidayDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const createdHolidays = [];
    if (holiday.workerIds && holiday.workerIds.length > 0) {
      for (const id of holiday.workerIds) {
        holiday.authorId = user.id;
        // holiday.authorName = `${user.lastName} ${user.firstName}`;
        const holidayData: Partial<Holiday> = { ...holiday };
        const userWorker = await entityManager.findOne(Worker, {
          where: { id: holiday.holderId },
        });
        const workerTree = await entityManager.findOne(Worker, {
          where: { id },
        });
        const human = await entityManager.findOne(Human, {
          where: { id: userWorker.humanId },
        });
        holidayData.holderUserName = `${human.lastName} ${human.firstName}`;
        holidayData.holidayType = AppointmentStatusType.Expected;
        // Create holiday
        holidayData.treeId = workerTree.appId;
        holidayData.userId = id;
        const newHoliday = entityManager.create(Holiday, holidayData);
        await entityManager.save(newHoliday);

        // Create holidayByUser
        const newHolidayByUser = entityManager.create(HolidayByuser, {
          itemId: newHoliday.id,
          userId: id,
          isNew: false,
          state: holiday.state,
        });
        await entityManager.save(newHolidayByUser);

        // Create holidayShift
        const newHolidayShift = entityManager.create(HolidayShift, {
          itemId: newHoliday.id,
          comId: null,
          senderId: id,
          holidayType: newHoliday.holidayType,
          authorId: newHoliday.holderId,
          authorName: newHoliday.holderUserName,
        });
        await entityManager.save(newHolidayShift);
        createdHolidays.push(newHoliday);
      }
    }

    return createdHolidays;
  }

  /**
   * See the [definition of the UpdateHolidayDto file]{@link UpdateHolidayDto} to see a list of required properties
   */
  async updateHoliday(
    id: number,
    user: IUser,
    holiday: UpdateHolidayDto,
  ): Promise<Holiday> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    if (holiday.workerIds && holiday.workerIds.length > 0) {
      let workerTree;
      for (const workerId of holiday.workerIds) {
        workerTree = await entityManager.findOne(Worker, {
          where: { id: workerId },
        });

        if (!workerTree) {
          throw new Error(`Worker with id ${workerId} not found.`);
        }
      }
      holiday.treeId = workerTree.appId;
      await entityManager.update(Holiday, id, holiday);
    } else {
      await entityManager.update(Holiday, id, holiday);
    }

    const updatedHoliday = await entityManager.findOne(Holiday, {
      where: { id: id },
    });

    if (updatedHoliday) {
      return updatedHoliday;
    }

    throw new HolidayNotFoundException(id);
  }

  async updateHolidayConfirm(
    ids: number[],
    user: IUser,
    holiday: UpdateHolidayDto,
  ): Promise<UpdatedHolidayWithShift[]> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const worker = await entityManager.findOne(Worker, {
      where: { id: holiday.authorId },
    });
    holiday.holderAppName = worker?.appName;
    holiday.confirmId = user.id;
    holiday.confirmDate = new Date();
    holiday.holidayType = AppointmentStatusType.Comfirm;
    const updatedResults: UpdatedHolidayWithShift[] = [];
    for (const id of ids) {
      await entityManager.update(Holiday, id, holiday);
      const updatedHoliday = await entityManager.findOne(Holiday, {
        where: { id: id },
      });
      const newHolidayShift = await entityManager.create(HolidayShift, {
        itemId: id,
        confirmId: user.id,
        comId: null,
        authorId: updatedHoliday.holderId,
        holidayType: updatedHoliday.holidayType,
        authorName: updatedHoliday.holderUserName,
        confirmDate: new Date(),
      });
      await entityManager.save(newHolidayShift);
      if (!updatedHoliday) {
        throw new HolidayNotFoundException(id);
      }
      const date = new Date();
      const dateOnly = date.toISOString().split('T')[0];
      const startDateOnly = updatedHoliday.startDay.toISOString().split('T')[0];
      if (startDateOnly === dateOnly) {
        console.log('orloooooooooo');
        if (updatedHoliday.workerIds) {
          for (const workerId of updatedHoliday.workerIds) {
            await entityManager.update(
              Worker,
              { id: workerId },
              {
                workerType: updatedHoliday.workerType,
              },
            );
          }
        }
      }

      updatedResults.push({
        holiday: updatedHoliday,
        holidayShift: newHolidayShift,
      });
    }
    return updatedResults;
  }

  async updateHolidayTransfer(
    ids: number[],
    user: IUser,
    holiday: UpdateHolidayDto,
  ): Promise<UpdatedHolidayWithShift[]> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const updatedResults: UpdatedHolidayWithShift[] = [];
    for (const id of ids) {
      holiday.holidayType = AppointmentStatusType.Expected;
      await entityManager.update(Holiday, id, holiday);
      const updatedHoliday = await entityManager.findOne(Holiday, {
        where: { id: id },
      });
      const reveiverData = await entityManager.findOne(HolidayShift, {
        where: {
          itemId: id,
          holidayType: AppointmentStatusType.Expected,
        },
        order: {
          createdAt: 'DESC',
        },
      });
      if (!reveiverData) {
        throw new Error(
          `Receiver data not found for appointment with ID ${id}`,
        );
      }
      const newHolidayShiftData = await entityManager.create(HolidayShift, {
        itemId: updatedHoliday.id,
        shiftDate: new Date(),
        comId: null,
        holidayType: AppointmentStatusType.Transfer,
        authorId: updatedHoliday.authorId,
        note: reveiverData.note,
        authorName: reveiverData.authorName,
        receiverId: holiday.authorId,
      });
      await entityManager.save(newHolidayShiftData);
      const newHolidayShift = await entityManager.create(HolidayShift, {
        itemId: updatedHoliday.id,
        shiftDate: new Date(),
        comId: null,
        holidayType: AppointmentStatusType.Expected,
        authorId: updatedHoliday.holderId,
        note: updatedHoliday.note,
        authorName: updatedHoliday.holderUserName,
        receiverId: holiday.holderId,
      });
      await entityManager.save(newHolidayShift);
      if (!updatedHoliday) {
        throw new HolidayNotFoundException(id);
      }
      updatedResults.push({
        holiday: updatedHoliday,
        holidayShift: newHolidayShift,
      });
    }
    return updatedResults;
  }

  async updateHolidayCancelled(
    ids: number[],
    user: IUser,
    holiday: UpdateHolidayDto,
  ): Promise<UpdatedHolidayWithShift[]> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    holiday.holidayType = AppointmentStatusType.Cancelled;
    holiday.closeDate = new Date();
    const updatedResults: UpdatedHolidayWithShift[] = [];
    for (const id of ids) {
      await entityManager.update(Holiday, id, holiday);
      const updatedHoliday = await entityManager.findOne(Holiday, {
        where: { id: id },
      });

      const newHolidayShift = await entityManager.create(HolidayShift, {
        itemId: updatedHoliday.id,
        shiftDate: new Date(),
        comId: null,
        authorId: updatedHoliday.authorId,
        holidayType: updatedHoliday.holidayType,
        authorName: updatedHoliday.authorName,
        receiverId: holiday.authorId,
      });
      await entityManager.save(newHolidayShift);
      const newHolidayClose = await entityManager.create(HolidayClose, {
        itemId: updatedHoliday.id,
        fdate: new Date(),
        note: holiday.closeNote,
      });
      if (!updatedHoliday) {
        throw new HolidayNotFoundException(id);
      }
      updatedResults.push({
        holiday: updatedHoliday,
        holidayClose: newHolidayClose,
      });

      if (updatedHoliday.workerIds) {
        for (const workerId of updatedHoliday.workerIds) {
          await entityManager.update(
            Worker,
            { id: workerId },
            {
              workerType: WorkType.Active,
            },
          );
        }
      }
    }
    return updatedResults;
  }

  /**
   * @deprecated Use deleteHoliday instead
   */
  async deleteHolidayById(id: number, user: IUser): Promise<void> {
    return this.deleteHoliday(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteHoliday(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Holiday, id);
    if (!deleteResponse.affected) {
      throw new HolidayNotFoundException(id);
    }
  }
}
