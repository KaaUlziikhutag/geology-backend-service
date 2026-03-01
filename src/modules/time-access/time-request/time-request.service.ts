import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTimeRequestDto } from './dto/create-time-request.dto';
import { UpdateTimeRequestDto } from './dto/update-time-request.dto';
import { GetTimeRequestDto } from './dto/get-time-request.dto';
import { Between, EntityManager, Equal, FindManyOptions, In } from 'typeorm';
import TimeRequest from './time-request.entity';
import TimeRequestNotFoundException from './exceptions/time-request-not-found.exception';
import { PageDto } from '../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../cloud/user/dto/get-user.dto';
import Trees from '../../human-resource/tree/tree.entity';
import {
  AppointmentStatusType,
  RequestType,
  WorkType,
} from '../../../utils/globalUtils';
import Worker from '../../human-resource/member/worker/worker.entity';

@Injectable()
export class TimeRequestService {
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
   * A method that fetches the TimeRequest from the database
   * @returns A promise with the list of TimeRequests
   */
  async getAllTimeRequest(query: GetTimeRequestDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<TimeRequest>['where'] = {};

    if (query.userId) {
      where.userId = Equal(query.userId);
    }

    if (query.type) {
      where.type = Equal(query.type);
    }

    if (query.timeStateId) {
      where.timeStateId = Equal(query.timeStateId);
    }

    if (query.startDate) {
      where.createdAt = Between(query.startDate, query.endDate);
    }

    if (query.treeId) {
      const findChildrenIds = async (
        parentId: number,
        collectedIds: number[] = [],
      ): Promise<number[]> => {
        const childrens = await entityManager.find(Trees, {
          where: { mid: parentId },
        });
        const childIds = childrens.map((c) => c.id);
        if (childIds.length === 0) {
          collectedIds.push(parentId);
        } else {
          for (const childId of childIds) {
            await findChildrenIds(childId, collectedIds);
          }
          collectedIds.push(parentId);
        }
        return collectedIds;
      };

      const id = query.treeId;
      const allChildIds = await findChildrenIds(id, []);

      // You need to use a more complex `where` clause to filter nested relation field
      Object.assign(where, {
        userWorker: {
          appId: In(allChildIds),
        },
      });
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

    const [items, count] = await entityManager.findAndCount(TimeRequest, {
      where,
      order: {
        createdAt: 'DESC',
      },
      relations: [
        'timeState',
        'userWorker',
        'userWorker.humans',
        'confirmWorker.humans',
        'appointment',
      ],
      skip,
      take: limit,
    });

    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a TimeRequest with a given id. Example:
   *
   * @example
   * const TimeRequest = await TimeRequestService.getTimeRequestById(1);
   */
  async getTimeRequestById(
    timeRequestId: number,
    user: GetUserDto,
  ): Promise<TimeRequest> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const timeRequest = await entityManager.findOne(TimeRequest, {
      where: { id: timeRequestId },
      relations: [
        'timeState',
        'userWorker.humans',
        'confirmWorker.humans',
        'appointment',
      ],
    });
    if (timeRequest) {
      return timeRequest;
    }
    throw new TimeRequestNotFoundException(timeRequestId);
  }

  /**
   *
   * @param TimeRequest createTimeRequest
   *
   */
  async createTimeRequest(timeRequest: CreateTimeRequestDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newTimeRequest = entityManager.create(TimeRequest, timeRequest);
    await entityManager.save(newTimeRequest);
    return newTimeRequest;
  }

  /**
   * See the [definition of the UpdateTimeRequestDto file]{@link UpdateTimeRequestDto} to see a list of required properties
   */
  async updateTimeRequest(
    id: number,
    user: GetUserDto,
    timeRequest: UpdateTimeRequestDto,
  ): Promise<TimeRequest> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(TimeRequest, id, timeRequest);
    const updatedTimeRequest = await entityManager.findOne(TimeRequest, {
      where: { id: id },
    });
    if (updatedTimeRequest) {
      return updatedTimeRequest;
    }
    throw new TimeRequestNotFoundException(id);
  }

  async updateTimeRequestConfirm(
    id: number,
    user: GetUserDto,
    timeRequest: UpdateTimeRequestDto,
  ): Promise<TimeRequest> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    timeRequest.status = AppointmentStatusType.Comfirm;
    await entityManager.update(TimeRequest, id, timeRequest);
    const workTypeMap = {
      [RequestType.TakeLeave]: WorkType.Freely,
      [RequestType.TakeVacation]: WorkType.HaveLongVacation,
      [RequestType.ShiftLeave]: WorkType.Shift,
      [RequestType.Appointment]: WorkType.Appointment,
    };
    const newWorkType = workTypeMap[timeRequest.type];
    if (newWorkType && timeRequest.userId) {
      await entityManager.update(Worker, timeRequest.userId, {
        workerType: newWorkType,
      });
    } else if (!timeRequest.userId) {
      throw new BadRequestException('userId is required to update Worker');
    }

    const updatedTimeRequest = await entityManager.findOne(TimeRequest, {
      where: { id: id },
    });
    if (updatedTimeRequest) {
      return updatedTimeRequest;
    }
    throw new TimeRequestNotFoundException(id);
  }

  async updateTimeRequestCancelled(
    id: number,
    user: GetUserDto,
    timeRequest: UpdateTimeRequestDto,
  ): Promise<TimeRequest> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    timeRequest.status = AppointmentStatusType.Cancelled;
    await entityManager.update(TimeRequest, id, timeRequest);
    await entityManager.update(Worker, timeRequest.userId, {
      workerType: WorkType.Active,
    });
    const updatedTimeRequest = await entityManager.findOne(TimeRequest, {
      where: { id: id },
    });
    if (updatedTimeRequest) {
      return updatedTimeRequest;
    }

    throw new TimeRequestNotFoundException(id);
  }

  /**
   * @deprecated Use deleteTimeRequest instead
   */
  async deleteTimeRequestById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteTimeRequest(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteTimeRequest(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(TimeRequest, id);
    if (!deleteResponse.affected) {
      throw new TimeRequestNotFoundException(id);
    }
  }
}
