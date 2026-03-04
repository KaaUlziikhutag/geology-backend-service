import { ConflictException, Injectable } from '@nestjs/common';
import { CreateDirectDto } from './dto/create-direct.dto';
import { UpdateDirectDto } from './dto/update-direct.dto';
import { GetDirectDto } from './dto/get-direct.dto';
import {
  Between,
  EntityManager,
  Equal,
  FindManyOptions,
  In,
  MoreThan,
  Raw,
  Repository,
} from 'typeorm';
import Directs from './entities/direct.entity';
import DirectNotFoundException from './exceptions/direct-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken, InjectRepository } from '@nestjs/typeorm';
import MainSchedules from './main-schedule/main-schedule.entity';
import Trees from '../../../human-resource/tree/tree.entity';
import DirectViewUser from './entities/direct-view-user.entity';
import { AppointmentStatusType } from '@utils/enum-utils';
import DirectLosts from '../../shared/lost/lost.entity';
import DirectHistory from './entities/direct-view-history.entity';
import Worker from '../../../human-resource/member/worker/worker.entity';
import DirectSchedules from './schedule/schedule.entity';
import IUser from '@modules/users/interface/user.interface';

@Injectable()
export class DirectService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(Directs)
    private readonly directRepository: Repository<Directs>,
    private moduleRef: ModuleRef,
  ) {}

  private async loadEntityManager(systemId: string): Promise<EntityManager> {
    return this.moduleRef.get(getEntityManagerToken(`ioffice_${systemId}`), {
      strict: false,
    });
  }

  /**
   * A method that fetches the Direct from the database
   * @returns A promise with the list of Directs
   */
  async getAllDirect(query: GetDirectDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Directs>['where'] = {};
    if (query.comId) where.comId = Equal(query.comId);
    if (query.authorId) where.authorId = Equal(query.authorId);
    if (query.isRegular !== undefined) where.isRegular = Equal(query.isRegular);
    if (query.userId) {
      where.viewUsers = [{ userId: Equal(query.userId) }];
    }
    if (query.treeId) {
      const findChildrenIds = async (
        parentId: number,
        collected = new Set<number>(),
      ): Promise<Set<number>> => {
        collected.add(parentId);
        const children = await entityManager.find(Trees, {
          where: { mid: parentId },
          select: ['id'],
        });
        for (const child of children) {
          if (!collected.has(child.id)) {
            await findChildrenIds(child.id, collected);
          }
        }
        return collected;
      };
      const id = +query.treeId;
      const allChildIdsSet = await findChildrenIds(id);
      const allChildIds = Array.from(allChildIdsSet);
      console.log('allChildIds', allChildIds);
      where.treeIds = Raw(
        (alias) => `${alias} && ARRAY[${allChildIds.join(',')}]::int[]`,
      );
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
      where.insertDate = Between(startOfMonth, endOfMonth);
    }
    const page = query.page && query.page > 0 ? Number(query.page) : 1;
    const limit = query.limit && query.limit > 0 ? Number(query.limit) : 10;
    const skip = (page - 1) * limit;
    const [items, count] = await this.directRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      relations: [
        'mainSchedules',
        'directLost',
        'trees',
        'viewUsers.worker.humans',
      ],
      skip,
      take: limit,
    });

    const pageMetaDto = new PageMetaDto({ page, limit, itemCount: count });
    return new PageDto(items, pageMetaDto);
  }

  async getAllDirectShift(query: GetDirectDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<DirectHistory>['where'] = {};
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
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
    const [items, count] = await entityManager.findAndCount(DirectHistory, {
      where,
      order: {
        createdAt: 'DESC',
      },
      relations: ['author.humans', 'confirm.humans'],
      skip: skip,
      take: limit,
    });
    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a Direct with a given id. Example:
   *
   * @example
   * const Direct = await DirectService.getDirectById(1);
   */
  async getDirectById(directId: number, user: IUser): Promise<Directs> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const direct = await entityManager.findOne(Directs, {
      where: { id: directId },
      relations: [
        'mainSchedules',
        'trees',
        'viewUsers.worker.humans',
        'directLost',
        'confirmWorker.humans',
      ],
    });
    if (direct) {
      return direct;
    }
    throw new DirectNotFoundException(directId);
  }

  /**
   *
   * @param Direct createDirect
   *
   */

  async createDirect(direct: CreateDirectDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    direct.status = AppointmentStatusType.Expected;
    direct.authorId = user.id;
    if (direct.treeIds && direct.treeIds.length > 0) {
      const trees = await entityManager.find(Trees, {
        where: { id: In(direct.treeIds) },
      });
      if (!trees || trees.length !== direct.treeIds.length) {
        throw new Error('Some of the treeIds are invalid');
      }
      direct.trees = trees;
    }
    let workerIds: number[] = [];
    if (direct.treeIds && direct.treeIds.length > 0) {
      const workers = await entityManager.find(Worker, {
        where: [{ depId: In(direct.treeIds) }, { appId: In(direct.treeIds) }],
      });
      workerIds = workers.map((w) => w.id);
    }
    const allUserIds = new Set<number>();
    (direct.viewUserIds || []).forEach((id) => allUserIds.add(id));
    workerIds.forEach((id) => allUserIds.add(id));
    const nowUtc = new Date(new Date().toISOString());
    const conflictingUserIds: number[] = [];
    for (const id of allUserIds) {
      const schedule = await entityManager.findOne(DirectSchedules, {
        where: {
          userId: id,
          date: MoreThan(nowUtc),
        },
      });
      if (schedule) {
        conflictingUserIds.push(id);
      }
    }
    if (conflictingUserIds.length > 0) {
      const conflictingUsers = await entityManager.find(Worker, {
        where: { id: In(conflictingUserIds) },
        relations: ['humans'],
      });
      throw new ConflictException({
        message: 'Some users already have a schedule.',
        users: conflictingUsers.map((worker) => ({
          id: worker.id,
          firstName: worker.humans?.firstName || null,
          lastName: worker.humans?.lastName || null,
        })),
      });
    }
    const newDirect = entityManager.create(Directs, direct);
    await entityManager.save(newDirect);
    if (allUserIds.size > 0) {
      const directViewUsers = Array.from(allUserIds).map((id) =>
        entityManager.create(DirectViewUser, {
          directId: newDirect.id,
          userId: id,
        }),
      );
      await entityManager.save(DirectViewUser, directViewUsers);
    }
    if (direct.week) {
      const mainSchedules = direct.week.map((mainSchedule) =>
        entityManager.create(MainSchedules, {
          ...mainSchedule,
          directId: newDirect.id,
        }),
      );
      let directLost = [];
      if (direct.lost) {
        directLost = direct.lost.map((lost) =>
          entityManager.create(DirectLosts, {
            ...lost,
            directId: newDirect.id,
          }),
        );
      }
      await entityManager.save(mainSchedules);
      await entityManager.save(directLost);
    }
    const newDirectHistory = entityManager.create(DirectHistory, {
      directId: newDirect.id,
      comId: null,
      status: direct.status,
      authorId: user.id,
      confirmId: newDirect.confirmId,
    });
    await entityManager.save(newDirectHistory);
    return newDirect;
  }

  async createDirectViewUsers(directViewUser: DirectViewUser, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newOption = entityManager.create(DirectViewUser, directViewUser);
    await entityManager.save(newOption);
    return newOption;
  }

  /**
   * See the [definition of the UpdateDirectDto file]{@link UpdateDirectDto} to see a list of required properties
   */
  async updateDirect(
    id: number,
    user: IUser,
    direct: UpdateDirectDto,
  ): Promise<Directs> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const existingDirect = await entityManager.findOne(Directs, {
      where: { id },
    });
    if (!existingDirect) {
      throw new DirectNotFoundException(id);
    }
    if (direct.treeIds && direct.treeIds.length > 0) {
      const trees = await entityManager.find(Trees, {
        where: { id: In(direct.treeIds) },
      });
      if (!trees || trees.length !== direct.treeIds.length) {
        throw new Error('Some of the treeIds are invalid');
      }
      existingDirect.trees = trees;
    }
    let workerIds: number[] = [];
    if (direct.treeIds && direct.treeIds.length > 0) {
      const workers = await entityManager.find(Worker, {
        where: [{ depId: In(direct.treeIds) }, { appId: In(direct.treeIds) }],
      });
      workerIds = workers.map((w) => w.id);
    }
    const allUserIds = new Set<number>();
    (direct.viewUserIds || []).forEach((id) => allUserIds.add(id));
    workerIds.forEach((id) => allUserIds.add(id));

    if (allUserIds.size > 0) {
      await entityManager.delete(DirectViewUser, { directId: id });
      const directViewUsers = Array.from(allUserIds).map((userId) =>
        entityManager.create(DirectViewUser, { directId: id, userId }),
      );
      await entityManager.save(directViewUsers);
    }

    if (direct.week && direct.week.length > 0) {
      await entityManager.delete(MainSchedules, { directId: id });
      for (const mainSchedule of direct.week) {
        const schedule = entityManager.create(MainSchedules, {
          ...mainSchedule,
          directId: id,
        });
        await entityManager.save(schedule);
      }
    }
    if (direct.lost) {
      await entityManager.delete(DirectLosts, { directId: id });
      const newDirectLost = direct.lost.map((lostData) =>
        entityManager.create(DirectLosts, { ...lostData, directId: id }),
      );
      await entityManager.save(newDirectLost);
    }
    Object.assign(existingDirect, direct);
    await entityManager.save(existingDirect);
    return existingDirect;
  }

  async updateDirectConfirm(
    ids: number[],
    user: IUser,
    direct: UpdateDirectDto,
  ): Promise<Directs[]> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    direct.status = AppointmentStatusType.Comfirm;
    const updatedDirects: Directs[] = [];
    for (const id of ids) {
      await entityManager.update(Directs, id, direct);
      const updatedDirect = await entityManager.findOne(Directs, {
        where: { id },
      });

      if (!updatedDirect) {
        throw new DirectNotFoundException(id);
      }
      const newDirectHistory = entityManager.create(DirectHistory, {
        directId: updatedDirect.id,
        comId: null,
        status: updatedDirect.status,
        authorId: user.id,
        confirmId: user.id,
        confirmDate: new Date(),
      });

      await entityManager.save(newDirectHistory);
      updatedDirects.push(updatedDirect);
    }

    return updatedDirects;
  }

  async updateDirectTransfer(
    ids: number[],
    user: IUser,
    direct: UpdateDirectDto,
  ): Promise<Directs[]> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const updatedDirects: Directs[] = [];
    for (const id of ids) {
      direct.status = AppointmentStatusType.Expected;
      await entityManager.update(Directs, id, direct);
      const updatedDirect = await entityManager.findOne(Directs, {
        where: { id },
      });
      if (!updatedDirect) {
        throw new DirectNotFoundException(id);
      }
      const reveiverData = await entityManager.findOne(DirectHistory, {
        where: {
          directId: id,
          status: AppointmentStatusType.Expected,
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
      const newDirectHistory = entityManager.create(DirectHistory, {
        directId: updatedDirect.id,
        comId: null,
        status: AppointmentStatusType.Transfer,
        authorId: user.id,
        confirmId: reveiverData.confirmId,
        confirmDate: new Date(),
      });
      await entityManager.save(newDirectHistory);
      const newDirectHistoryData = entityManager.create(DirectHistory, {
        directId: updatedDirect.id,
        comId: null,
        status: AppointmentStatusType.Expected,
        authorId: user.id,
        confirmId: direct.confirmId,
        confirmDate: new Date(),
      });
      await entityManager.save(newDirectHistoryData);
      updatedDirects.push(updatedDirect);
    }
    return updatedDirects;
  }

  async updateDirectCancelled(
    ids: number[],
    user: IUser,
    direct: UpdateDirectDto,
  ): Promise<Directs[]> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    direct.status = AppointmentStatusType.Cancelled;
    const updatedDirects: Directs[] = [];
    for (const id of ids) {
      await entityManager.update(Directs, id, { status: direct.status }); // closeNote хассан
      const updatedDirect = await entityManager.findOne(Directs, {
        where: { id },
      });

      if (!updatedDirect) {
        throw new DirectNotFoundException(id);
      }
      const newDirectHistory = entityManager.create(DirectHistory, {
        directId: updatedDirect.id,
        comId: null,
        status: updatedDirect.status,
        authorId: user.id,
        closeNote: direct.closeNote || null, // Утга нь байвал хадгална, үгүй бол null
        confirmId: user.id,
        confirmDate: new Date(),
      });
      await entityManager.save(newDirectHistory);
      updatedDirects.push(updatedDirect);
    }
    return updatedDirects;
  }

  /**
   * @deprecated Use deleteDirect instead
   */
  async deleteDirectById(id: number, user: IUser): Promise<void> {
    return this.deleteDirect(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteDirect(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Directs, id);
    if (!deleteResponse.affected) {
      throw new DirectNotFoundException(id);
    }
  }
}
