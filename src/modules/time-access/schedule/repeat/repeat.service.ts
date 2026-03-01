import { Injectable } from '@nestjs/common';
import { CreateRepeatDto } from './dto/create-repeat.dto';
import { UpdateRepeatDto } from './dto/update-repeat.dto';
import { GetRepeatDto } from './dto/get-repeat.dto';
import { Between, EntityManager, Equal, FindManyOptions, ILike } from 'typeorm';
import { PageDto } from '../../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../cloud/user/dto/get-user.dto';
import Repeats from './entities/repeat.entity';
import RepeatNotFoundException from './exceptions/repeat-not-found.exception';
import { RepeatDetailService } from './detail/repeat-detail.service';
import { AppointmentStatusType } from '../../../../utils/globalUtils';
import RepeatHistory from './entities/repeat-history.entity';

@Injectable()
export class RepeatService {
  /**
   * @ignore
   */
  constructor(
    private moduleRef: ModuleRef,
    private readonly repeatDetailService: RepeatDetailService,
  ) {}

  private async loadEntityManager(systemId: string): Promise<EntityManager> {
    return this.moduleRef.get(getEntityManagerToken(`ioffice_${systemId}`), {
      strict: false,
    });
  }

  /**
   * A method that fetches the Repeat from the database
   * @returns A promise with the list of Repeats
   */
  async getAllRepeat(query: GetRepeatDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Repeats>['where'] = {};
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    if (query.name) {
      where.name = ILike('%' + query.name + '%');
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
      where.createdAt = Between(startOfMonth, endOfMonth);
    }
    if (query.userId) {
      where.confirmId = Equal(query.userId);
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
    const [items, count] = await entityManager.findAndCount(Repeats, {
      where,
      order: {
        createdAt: 'DESC',
      },
      relations: ['repeatDetails.graphic.graphicStep', 'repeatSchedules'],
      skip: skip,
      take: limit,
    });
    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  async getShiftRepeat(query: GetRepeatDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<RepeatHistory>['where'] = {};
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    if (query.repeatId) {
      where.repeatId = Equal(query.repeatId);
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
    const [items, count] = await entityManager.findAndCount(RepeatHistory, {
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
   * A method that fetches a Repeat with a given id. Example:
   *
   * @example
   * const Repeat = await RepeatService.getRepeatById(1);
   */
  async getRepeatById(repeatId: number, user: GetUserDto): Promise<Repeats> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const repeat = await entityManager.findOne(Repeats, {
      where: { id: repeatId },
      relations: [
        'repeatDetails',
        'repeatDetails.graphic',
        'repeatDetails.viewUsers.worker.humans',
        'confirmWorker.humans',
      ],
    });

    if (repeat) {
      return repeat;
    }
    throw new RepeatNotFoundException(repeatId);
  }

  /**
   *
   * @param Repeat createRepeat
   *
   */

  async createRepeat(repeat: CreateRepeatDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    console.log('=================>repeat', repeat.startDate, repeat.endDate);
    if (
      repeat.startDate &&
      repeat.startDateHour != null &&
      repeat.startDateMinute != null
    ) {
      repeat.startDate = new Date(
        Date.UTC(
          new Date(repeat.startDate).getUTCFullYear(),
          new Date(repeat.startDate).getUTCMonth(),
          new Date(repeat.startDate).getUTCDate(),
          repeat.startDateHour,
          repeat.startDateMinute,
          0,
          0,
        ),
      );
    }
    if (
      repeat.endDate &&
      repeat.endDateHour != null &&
      repeat.endDateMinute != null
    ) {
      repeat.endDate = new Date(
        Date.UTC(
          new Date(repeat.endDate).getUTCFullYear(),
          new Date(repeat.endDate).getUTCMonth(),
          new Date(repeat.endDate).getUTCDate(),
          repeat.endDateHour,
          repeat.endDateMinute,
          0,
          0,
        ),
      );
    }
    const newRepeat = entityManager.create(Repeats, repeat);
    console.log('==================>newRepeat', newRepeat);
    await entityManager.save(newRepeat);
    if (repeat.detail) {
      const repeatDetail = await Promise.all(
        repeat.detail.map(async (repeatDetail) =>
          this.repeatDetailService.createRepeatDetail(
            { ...repeatDetail, repeatId: newRepeat.id },
            user,
          ),
        ),
      );
      await entityManager.save(repeatDetail);
    }
    return newRepeat;
  }

  /**
   * See the [definition of the UpdateRepeatDto file]{@link UpdateRepeatDto} to see a list of required properties
   */
  async updateRepeat(
    repeatId: number,
    user: GetUserDto,
    repeat: UpdateRepeatDto,
  ): Promise<Repeats> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const { detail, ...repeatData } = repeat;
    await entityManager.update(Repeats, repeatId, repeatData);
    const updatedRepeat = await entityManager.findOne(Repeats, {
      where: { id: repeatId },
    });
    if (!updatedRepeat) {
      throw new RepeatNotFoundException(repeatId);
    }
    if (detail?.length) {
      await Promise.all(
        detail.map((item) =>
          this.repeatDetailService.updateMultipleRepeatDetails(user, [
            { ...item, repeatId },
          ]),
        ),
      );
    }
    return updatedRepeat;
  }

  async updateRepeatConfirm(
    ids: number[],
    user: GetUserDto,
    repeat: UpdateRepeatDto,
  ): Promise<Repeats[]> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    repeat.status = AppointmentStatusType.Comfirm;
    const updatedRepeats: Repeats[] = [];
    for (const id of ids) {
      await entityManager.update(Repeats, id, repeat);
      const updatedRepeat = await entityManager.findOne(Repeats, {
        where: { id },
      });
      if (!updatedRepeat) {
        throw new RepeatNotFoundException(id);
      }
      const newRepeatHistory = entityManager.create(RepeatHistory, {
        repeatId: updatedRepeat.id,
        comId: user.companyId,
        status: updatedRepeat.status,
        authorId: user.workerId,
        confirmId: user.workerId,
        confirmDate: new Date(),
      });
      await entityManager.save(newRepeatHistory);
      updatedRepeats.push(updatedRepeat);
    }
    return updatedRepeats;
  }

  async updateRepeatCancelled(
    ids: number[],
    user: GetUserDto,
    repeat: UpdateRepeatDto,
  ): Promise<Repeats[]> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    repeat.status = AppointmentStatusType.Cancelled;
    const updatedRepeats: Repeats[] = [];
    for (const id of ids) {
      await entityManager.update(Repeats, id, repeat);
      const updatedRepeat = await entityManager.findOne(Repeats, {
        where: { id },
      });
      if (!updatedRepeat) {
        throw new RepeatNotFoundException(id);
      }
      const newRepeatHistory = entityManager.create(RepeatHistory, {
        repeatId: updatedRepeat.id,
        comId: user.companyId,
        status: updatedRepeat.status,
        authorId: user.workerId,
        confirmId: user.workerId,
        closeNote: repeat.closeNote,
        confirmDate: new Date(),
      });
      await entityManager.save(newRepeatHistory);
      updatedRepeats.push(updatedRepeat);
    }
    return updatedRepeats;
  }

  async updateRepeatTransfer(
    ids: number[],
    user: GetUserDto,
    repeat: UpdateRepeatDto,
  ): Promise<Repeats[]> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const updatedRepeats: Repeats[] = [];
    for (const id of ids) {
      repeat.status = AppointmentStatusType.Expected;
      await entityManager.update(Repeats, id, repeat);
      const updatedRepeat = await entityManager.findOne(Repeats, {
        where: { id },
      });
      if (!updatedRepeat) {
        throw new RepeatNotFoundException(id);
      }
      const reveiverData = await entityManager.findOne(RepeatHistory, {
        where: {
          repeatId: id,
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
      const newRepeatHistory = entityManager.create(RepeatHistory, {
        repeatId: updatedRepeat.id,
        comId: user.companyId,
        status: AppointmentStatusType.Transfer,
        authorId: user.workerId,
        confirmId: reveiverData.confirmId,
        closeNote: repeat.closeNote,
        confirmDate: new Date(),
      });
      await entityManager.save(newRepeatHistory);

      const newRepeatHistoryData = entityManager.create(RepeatHistory, {
        repeatId: updatedRepeat.id,
        comId: user.companyId,
        status: AppointmentStatusType.Expected,
        authorId: user.workerId,
        confirmId: repeat.confirmId,
        closeNote: repeat.closeNote,
        confirmDate: new Date(),
      });
      await entityManager.save(newRepeatHistoryData);
      updatedRepeats.push(updatedRepeat);
    }
    return updatedRepeats;
  }

  /**
   * @deprecated Use deleteRepeat instead
   */
  async deleteRepeatById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteRepeat(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteRepeat(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Repeats, id);
    if (!deleteResponse.affected) {
      throw new RepeatNotFoundException(id);
    }
  }
}
