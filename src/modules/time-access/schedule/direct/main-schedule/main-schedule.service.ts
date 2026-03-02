import { Injectable } from '@nestjs/common';
import { CreateMainScheduleDto } from './dto/create-main-schedule.dto';
import { UpdateMainScheduleDto } from './dto/update-main-schedule.dto';
import { GetMainScheduleDto } from './dto/get-main-schedule.dto';
import { EntityManager, Equal, FindManyOptions, Repository } from 'typeorm';
import MainSchedules from './main-schedule.entity';
import MainScheduleNotFoundException from './exceptions/main-schedule-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MainScheduleService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(MainSchedules)
    private readonly mainScheduleRepository: Repository<MainSchedules>,
    private moduleRef: ModuleRef,
  ) {}

  private async loadEntityManager(systemId: string): Promise<EntityManager> {
    return this.moduleRef.get(getEntityManagerToken(`ioffice_${systemId}`), {
      strict: false,
    });
  }

  /**
   * A method that fetches the MainSchedule from the database
   * @returns A promise with the list of MainSchedules
   */
  async getAllMainSchedules(query: GetMainScheduleDto) {
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
    const [items, count] = await this.mainScheduleRepository.findAndCount({
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
  async getMainScheduleById(mainScheduleId: number): Promise<MainSchedules> {
    const mainSchedule = await this.mainScheduleRepository.findOne({
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
  async createMainSchedule(mainSchedule: CreateMainScheduleDto) {
    const newMainSchedule = this.mainScheduleRepository.create(mainSchedule);
    await this.mainScheduleRepository.save(newMainSchedule);
    return newMainSchedule;
  }

  /**
   * See the [definition of the UpdateMainScheduleDto file]{@link UpdateMainScheduleDto} to see a list of required properties
   */
  async updateMainSchedule(
    id: number,
    mainSchedule: UpdateMainScheduleDto,
  ): Promise<MainSchedules> {
    await this.mainScheduleRepository.update(id, mainSchedule);
    const updatedMainSchedule = await this.mainScheduleRepository.findOne({
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
  async deleteMainScheduleById(id: number): Promise<void> {
    return this.deleteMainSchedule(id);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteMainSchedule(id: number): Promise<void> {
    const deleteResponse = await this.mainScheduleRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new MainScheduleNotFoundException(id);
    }
  }
}
