import { Injectable } from '@nestjs/common';
import { CreateTimeStateDto } from './dto/create-time-state.dto';
import { UpdateTimeStateDto } from './dto/update-time-state.dto';
import { GetTimeStateDto } from './dto/get-time-state.dto';
import {
  Between,
  EntityManager,
  Equal,
  FindManyOptions,
  Repository,
} from 'typeorm';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken, InjectRepository } from '@nestjs/typeorm';
import TimeState from './time-state.entity';
import TimeStateNotFoundException from './exceptions/time-state-not-found.exception';
import IUser from '@modules/users/interface/user.interface';

@Injectable()
export class TimeStateService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(TimeState)
    private readonly timeStateRepository: Repository<TimeState>,
  ) {}

  /**
   * A method that fetches the Option from the database
   * @returns A promise with the list of Options
   */
  async getAllTimeState(query: GetTimeStateDto, user: IUser) {
    const where: FindManyOptions<TimeState>['where'] = {};
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    if (query.type) {
      where.type = Equal(query.type);
    }
    if (query.startDate) {
      where.createdAt = Between(query.startDate, query.endDate);
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
    const [items, count] = await this.timeStateRepository.findAndCount({
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
   * A method that fetches a Option with a given id. Example:
   *
   * @example
   * const Option = await OptionService.getOptionById(1);
   */
  async getTimeStateById(timeStateId: number, user: IUser): Promise<TimeState> {
    const option = await this.timeStateRepository.findOne({
      where: { id: timeStateId },
    });
    if (option) {
      return option;
    }
    throw new TimeStateNotFoundException(timeStateId);
  }

  /**
   *
   * @param Option createOption
   *
   */
  async createTimeState(timeState: CreateTimeStateDto, user: IUser) {
    const newOption = this.timeStateRepository.create(timeState);
    await this.timeStateRepository.save(newOption);
    return newOption;
  }

  /**
   * See the [definition of the UpdateOptionDto file]{@link UpdateOptionDto} to see a list of required properties
   */
  async updateTimeState(
    timeStateId: number,
    timeState: UpdateTimeStateDto,
  ): Promise<TimeState> {
    await this.timeStateRepository.update(timeStateId, timeState);
    const updatedTimeState = await this.timeStateRepository.findOne({
      where: { id: timeStateId },
    });
    if (updatedTimeState) {
      return updatedTimeState;
    }
    throw new TimeStateNotFoundException(timeStateId);
  }

  /**
   * @deprecated Use deleteOption instead
   */
  async deleteTimeStateById(id: number, user: IUser): Promise<void> {
    return this.deleteTimeState(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteTimeState(id: number, user: IUser): Promise<void> {
    const deleteResponse = await this.timeStateRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new TimeStateNotFoundException(id);
    }
  }
}
