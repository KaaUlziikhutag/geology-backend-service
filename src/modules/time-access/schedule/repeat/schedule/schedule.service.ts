import { Injectable } from '@nestjs/common';
import { CreateRepeatScheduleDto } from './dto/create-schedule.dto';
import { UpdateRepeatScheduleDto } from './dto/update-schedule.dto';
import { GetRepeatScheduleDto } from './dto/get-schedule.dto';
import {
  EntityManager,
  Equal,
  FindManyOptions,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import RepeatSchedules from './schedule.entity';
import DirectScheduleNotFoundException from './exceptions/schedule-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken, InjectRepository } from '@nestjs/typeorm';
import RepeatDetails from '../detail/entities/repeat-detail.entity';
import DirectSchedules from '../../direct/schedule/schedule.entity';

@Injectable()
export class RepeatScheduleService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(RepeatSchedules)
    private readonly repeatScheduleRepository: Repository<RepeatSchedules>,
    @InjectRepository(DirectSchedules)
    private readonly directScheduleRepository: Repository<DirectSchedules>,
    private moduleRef: ModuleRef,
  ) {}

  private async loadEntityManager(systemId: string): Promise<EntityManager> {
    return this.moduleRef.get(getEntityManagerToken(`ioffice_${systemId}`), {
      strict: false,
    });
  }

  /**
   * A method that fetches the RepeatSchedule from the database
   * @returns A promise with the list of RepeatSchedules
   */
  async getAllRepeatSchedules(query: GetRepeatScheduleDto) {
    const repeatWhere: FindManyOptions<RepeatSchedules>['where'] = {};
    if (query.repeatId) {
      repeatWhere.repeatId = Equal(query.repeatId);
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
    const [repeatItems, repeatCount] =
      await this.repeatScheduleRepository.findAndCount({
        where: repeatWhere,
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
      });
    const repeatMeta = new PageMetaDto({ page, limit, itemCount: repeatCount });
    const repeatSchedules = new PageDto(repeatItems, repeatMeta);
    const directWhere: FindManyOptions<DirectSchedules>['where'] = {};
    if (query.directId) {
      directWhere.directId = Equal(query.directId);
    }
    const [directItems, directCount] =
      await this.directScheduleRepository.findAndCount({
        where: directWhere,
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
      });
    const directMeta = new PageMetaDto({ page, limit, itemCount: directCount });
    const directSchedules = new PageDto(directItems, directMeta);
    return {
      repeatSchedules,
      directSchedules,
    };
  }

  /**
   * A method that fetches a RepeatSchedule with a given id. Example:
   *
   * @example
   * const RepeatSchedule = await RepeatScheduleService.getDirectScheduleById(1);
   */
  async getRepeatScheduleById(
    directScheduleId: number,
  ): Promise<RepeatSchedules> {
    const directSchedule = await this.repeatScheduleRepository.findOne({
      where: { id: directScheduleId },
      relations: ['worker.humans', 'repeats'],
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
  async createRepeatSchedule(directSchedule: CreateRepeatScheduleDto) {
    const newDirectSchedule =
      this.repeatScheduleRepository.create(directSchedule);
    return await this.repeatScheduleRepository.save(newDirectSchedule);
  }

  async createRepeatScheduleCron(repeatDetail: RepeatDetails) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const graphic = repeatDetail.graphic;
    const repeats = repeatDetail.repeats;
    const startPosition = repeatDetail.startPosition ?? 0; // default 0
    if (!graphic || !repeats || !graphic.graphicStep?.length) {
      throw new Error('Graphic, Repeat эсвэл GraphicStep дутуу байна');
    }
    const lastSchedule = await this.repeatScheduleRepository.findOne({
      where: { graphicId: repeatDetail.graphicId },
      order: { createdAt: 'DESC' },
    });
    if (lastSchedule && graphic.updatedAt > lastSchedule.createdAt) {
      await this.repeatScheduleRepository.delete({
        graphicId: repeatDetail.graphicId,
        startDate: MoreThanOrEqual(today),
      });
    }
    const sortedSteps = graphic.graphicStep.sort(
      (a, b) => a.position - b.position,
    );
    const startIndex = sortedSteps.findIndex(
      (step) => step.position === startPosition,
    );
    if (startIndex === -1) {
      throw new Error(`startPosition=${startPosition} тохирох алхам байхгүй`);
    }
    const stepsToSchedule = [
      ...sortedSteps.slice(startIndex),
      ...sortedSteps.slice(0, startIndex),
    ];
    for (const viewUser of repeatDetail.viewUsers || []) {
      const userId = viewUser.userId;
      const existingSchedules = await this.repeatScheduleRepository.find({
        where: {
          graphicId: repeatDetail.graphicId,
          userId,
          startDate: MoreThanOrEqual(today),
        },
      });
      if (existingSchedules.length > 0) {
        continue;
      }
      let currentDateTime = new Date(
        Math.max(new Date(repeats.startDate).getTime(), today.getTime()),
      );
      const schedules = [];
      let stepIndex = 0;
      scheduleLoop: while (true) {
        const step = stepsToSchedule[stepIndex];
        const start = new Date(currentDateTime);
        const end = new Date(start);
        end.setHours(end.getHours() + step.duration);
        if (end > new Date(repeats.endDate)) {
          break scheduleLoop;
        }
        const startTime = step.isWork ? start.toTimeString().slice(0, 5) : null;
        const endTime = step.isWork ? end.toTimeString().slice(0, 5) : null;
        const newSchedule = this.repeatScheduleRepository.create({
          graphicId: repeatDetail.graphicId,
          userId,
          startDate: start,
          endDate: end,
          startTime,
          endTime,
          detailId: repeatDetail.id,
          repeatId: repeats.id,
          isWork: step.isWork,
        });
        schedules.push(newSchedule);
        currentDateTime = new Date(end);
        stepIndex = (stepIndex + 1) % stepsToSchedule.length; // ♻️ Циклик давталт
      }
      if (schedules.length > 0) {
        await this.repeatScheduleRepository.save(schedules);
      }
    }
  }

  /**
   * See the [definition of the UpdateRepeatScheduleDto file]{@link UpdateRepeatScheduleDto} to see a list of required properties
   */
  async updateRepeatSchedule(
    id: number,
    repeatSchedule: UpdateRepeatScheduleDto,
  ): Promise<RepeatSchedules> {
    await this.repeatScheduleRepository.update(id, repeatSchedule);
    const updatedDirectSchedule = await this.repeatScheduleRepository.findOne({
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
  async deleteRepeatScheduleById(id: number): Promise<void> {
    return this.deleteRepeatSchedule(id);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteRepeatSchedule(id: number): Promise<void> {
    const deleteResponse = await this.repeatScheduleRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new DirectScheduleNotFoundException(id);
    }
  }
}
