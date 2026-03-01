import { Injectable } from '@nestjs/common';
import { CreateAccessDto } from './dto/create-access.dto';
import { Between, EntityManager, Equal, FindManyOptions } from 'typeorm';
import AccesssTime from './entities/access-time.entity';
import AccessNotFoundException from './exceptions/access-not-found.exception';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../cloud/user/dto/get-user.dto';
import { GetAccessDto } from './dto/get-access.dto';
import { PageMetaDto } from '../../../utils/dto/pageMeta.dto';
import { PageDto } from '../../../utils/dto/page.dto';
import RepeatSchedules from '../schedule/repeat/schedule/schedule.entity';
import DirectSchedules from '../schedule/direct/schedule/schedule.entity';
import AccessTempTimes from './entities/access-temp.entity';
import AccessTimes from './entities/access-time.entity';
import Worker from '../../human-resource/member/worker/worker.entity';
import Directs from '../schedule/direct/entities/direct.entity';
import Repeats from '../schedule/repeat/entities/repeat.entity';
import { UserService } from '../../cloud/user/user.service';

@Injectable()
export class AccessService {
  /**
   * @ignore
   */
  constructor(
    private moduleRef: ModuleRef,
    private readonly userService: UserService,
  ) {}

  private async loadEntityManager(systemId: string): Promise<EntityManager> {
    return this.moduleRef.get(getEntityManagerToken(`ioffice_${systemId}`), {
      strict: false,
    });
  }

  async getAllAccess(query: GetAccessDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const page =
      query.page && !isNaN(query.page) && query.page > 0
        ? Number(query.page)
        : 1;
    const limit =
      query.limit && !isNaN(query.limit) && query.limit > 0
        ? Number(query.limit)
        : 10;
    const skip = (page - 1) * limit;
    const whereRepeat: FindManyOptions<RepeatSchedules>['where'] = {};
    const whereDirect: FindManyOptions<DirectSchedules>['where'] = {};
    if (query.userId) {
      whereRepeat.userId = Equal(query.userId);
      whereDirect.userId = Equal(query.userId);
    }
    if (query.scheduleStatus) {
      whereRepeat.scheduleStatus = Equal(query.scheduleStatus);
      whereDirect.scheduleStatus = Equal(query.scheduleStatus);
    }
    if (query.startDate && query.endDate) {
      whereRepeat.startDate = Between(query.startDate, query.endDate);
      whereDirect.date = Between(query.startDate, query.endDate);
    } else if (query.date) {
      whereRepeat.startDate = Equal(query.date);
      whereDirect.date = Equal(query.date);
    }
    const repeatCount = await entityManager.count(RepeatSchedules, {
      where: whereRepeat,
    });
    const directCount = await entityManager.count(DirectSchedules, {
      where: whereDirect,
    });
    const totalCount = repeatCount + directCount;
    let repeatItems: RepeatSchedules[] = [];
    let directItems: DirectSchedules[] = [];
    if (skip + limit <= repeatCount) {
      repeatItems = await entityManager.find(RepeatSchedules, {
        where: whereRepeat,
        relations: ['worker.humans'],
        skip,
        take: limit,
      });
    } else if (skip >= repeatCount) {
      const directSkip = skip - repeatCount;
      directItems = await entityManager.find(DirectSchedules, {
        where: whereDirect,
        order: { createdAt: 'DESC' },
        skip: directSkip,
        relations: ['worker.humans'],
        take: limit,
      });
    } else {
      const repeatTake = repeatCount - skip;
      const directTake = limit - repeatTake;
      repeatItems = await entityManager.find(RepeatSchedules, {
        where: whereRepeat,
        order: { createdAt: 'DESC' },
        relations: ['worker.humans'],
        skip,
        take: repeatTake,
      });
      directItems = await entityManager.find(DirectSchedules, {
        where: whereDirect,
        order: { createdAt: 'DESC' },
        relations: ['worker.humans'],
        skip: 0,
        take: directTake,
      });
    }
    const userMap = new Map();
    for (const item of repeatItems) {
      if (!userMap.has(item.userId)) {
        userMap.set(
          item.userId,
          await this.userService.getUserById(item.userId),
        );
      }
      item.user = userMap.get(item.userId);
    }
    const items = [...repeatItems, ...directItems];
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount: totalCount });

    return new PageDto(items, pageMetaDto);
  }

  async getAllWorkers(query: GetAccessDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const page =
      query.page && !isNaN(query.page) && query.page > 0
        ? Number(query.page)
        : 1;
    const limit =
      query.limit && !isNaN(query.limit) && query.limit > 0
        ? Number(query.limit)
        : 10;
    const skip = (page - 1) * limit;
    let repeatItems = [];
    let repeatCount = 0;
    let directItems = [];
    let directCount = 0;
    const repeatQuery = entityManager
      .getRepository(Repeats)
      .createQueryBuilder('repeats')
      .leftJoinAndSelect('repeats.repeatDetails', 'repeatDetails')
      .leftJoinAndSelect('repeatDetails.viewUsers', 'viewUsers')
      .leftJoinAndSelect('repeats.repeatSchedules', 'repeatSchedules')
      .leftJoinAndSelect('repeatDetails.graphic', 'graphic')
      .leftJoinAndSelect('graphic.graphicStep', 'graphicStep')
      .leftJoinAndSelect('viewUsers.worker', 'worker')
      .leftJoinAndSelect('worker.humans', 'humans')
      .leftJoinAndSelect('worker.depTree', 'depTree')
      .leftJoinAndSelect('worker.appTree', 'appTree')
      .leftJoinAndSelect('depTree.parent', 'comTree')
      .select([
        'repeats.id',
        'repeats.name',
        'repeatDetails.id',
        'viewUsers.id',
        'worker.id',
        'worker.code',
        'worker.workerType',
        'humans.id',
        'humans.lastName',
        'humans.firstName',
        'depTree.id',
        'depTree.name',
        'appTree.id',
        'appTree.name',
        'comTree.id',
        'comTree.name',
        'graphic.id',
        'graphic.name',
        'graphicStep.id',
        'graphicStep.duration',
        'graphicStep.isWork',
        'graphicStep.position',
        'repeatSchedules.id',
        'repeatSchedules.startDate',
        'repeatSchedules.endDate',
        'repeatSchedules.time1',
        'repeatSchedules.time2',
        'repeatSchedules.isWork',
      ]);
    if (query.userId) {
      repeatQuery.andWhere('viewUsers.userId = :userId', {
        userId: query.userId,
      });
    }
    if (query.startDate) {
      repeatQuery.andWhere(
        'repeatSchedules.startDate BETWEEN :startDate AND :endDate',
        {
          startDate: query.startDate,
          endDate: query.endDate,
        },
      );
    }
    repeatQuery.andWhere('repeatSchedules.isWork = :isWork', { isWork: true });
    repeatQuery.skip(skip).take(limit);
    [repeatItems, repeatCount] = await repeatQuery.getManyAndCount();
    repeatItems = repeatItems.map((item) => ({ ...item, type: 'Ээлжийн' }));
    if (repeatItems.length < limit) {
      const directsQuery = entityManager
        .getRepository(Directs)
        .createQueryBuilder('directs')
        .leftJoinAndSelect('directs.viewUsers', 'viewUsers')
        .leftJoinAndSelect('directs.mainSchedules', 'mainSchedules')
        .leftJoinAndSelect('directs.directSchedules', 'directSchedules')
        .leftJoinAndSelect('viewUsers.worker', 'worker')
        .leftJoinAndSelect('worker.humans', 'humans')
        .leftJoinAndSelect('worker.depTree', 'depTree')
        .leftJoinAndSelect('worker.appTree', 'appTree')
        .leftJoinAndSelect('depTree.parent', 'comTree')
        .select([
          'directs.id',
          'directs.name',
          'directs.createdAt',
          'viewUsers.id',
          'worker.id',
          'worker.code',
          'worker.workerType',
          'humans.lastName',
          'humans.firstName',
          'depTree.id',
          'depTree.name',
          'appTree.name',
          'appTree.id',
          'comTree.id',
          'comTree.name',
          'mainSchedules.time1',
          'mainSchedules.time4',
          'directSchedules.id',
          'directSchedules.time1',
          'directSchedules.time2',
          'directSchedules.lostTime1',
          'directSchedules.lostTime2',
          'directSchedules.overTime1',
          'directSchedules.overTime2',
          'directSchedules.isAbsent',
          'directSchedules.date',
          'directSchedules.day',
          'directSchedules.userId',
          'directSchedules.startTime',
          'directSchedules.endTime',
          'directSchedules.scheduleStatus',
        ]);
      if (query.userId) {
        directsQuery.andWhere('viewUsers.userId = :userId', {
          userId: query.userId,
        });
      }
      if (query.startDate) {
        directsQuery.andWhere(
          'directSchedules.date BETWEEN :startDate AND :endDate',
          {
            startDate: query.startDate,
            endDate: query.endDate,
          },
        );
      }
      directsQuery.orderBy('directs.createdAt', 'DESC');
      directsQuery.skip(0).take(limit - repeatItems.length);
      [directItems, directCount] = await directsQuery.getManyAndCount();
      directItems = directItems.map((item) => {
        const newItem = {
          ...item,
          type: 'Шугаман',
          viewUsers:
            item.viewUsers?.map((viewUser) => {
              return {
                ...viewUser,
                directSchedules:
                  item.directSchedules?.filter(
                    (schedule) => schedule.userId === viewUser.worker?.id,
                  ) || [],
              };
            }) || [],
        };
        delete newItem.directSchedules;
        return newItem;
      });
    }

    const items = [...repeatItems, ...directItems];
    const itemCount = repeatCount + directCount;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a Access with a given id. Example:
   *
   * @example
   * const Access = await AccessService.getAccessById(1);
   */
  async getAccessById(
    accessId: number,
    user: GetUserDto,
  ): Promise<AccesssTime> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const access = await entityManager.findOne(AccesssTime, {
      where: { id: accessId },
    });
    if (access) {
      return access;
    }
    throw new AccessNotFoundException(accessId);
  }

  /**
   *
   * @param Access createAccess
   *
   */

  async createAccess(access: CreateAccessDto, context?: string) {
    const entityManager = await this.loadEntityManager('gslab');
    const newAccess = entityManager.create(AccessTempTimes, access);
    await entityManager.save(newAccess);
    if (access.result && Array.isArray(access.result.timeData)) {
      const timeData = access.result.timeData;
      const uniqueSet = new Set<string>();
      const uniqueData = timeData.filter((item) => {
        const dateKey = new Date(item.attendanceTime)
          .toISOString()
          .slice(0, 16);
        const key = `${dateKey}-${item.terminalNumber}-${item.terminalUserId}`;
        if (uniqueSet.has(key)) {
          return false;
        }
        uniqueSet.add(key);
        return true;
      });
      const userCodes = [
        ...new Set(uniqueData.map((item) => item.terminalUserId)),
      ];
      const workers = await entityManager.find(Worker, {
        where: userCodes.map((code) => ({ code })),
      });
      const workerMap = new Map<string, Worker>();
      workers.forEach((worker) => workerMap.set(worker.code, worker));
      const accessTimesToSave = uniqueData
        .map((item) => {
          const worker = workerMap.get(item.terminalUserId);
          if (!worker) return null;
          return entityManager.create(AccessTimes, {
            date: new Date(item.attendanceTime),
            terminalNumber: item.terminalNumber,
            userId: worker.id,
          });
        })
        .filter(Boolean);
      if (accessTimesToSave.length > 0) {
        await entityManager.save(AccessTimes, accessTimesToSave);
      }
    }
    return newAccess;
  }
}
