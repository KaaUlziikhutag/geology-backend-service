import { Injectable } from '@nestjs/common';
import { CreateTimeStateDto } from './dto/create-time-state.dto';
import { UpdateTimeStateDto } from './dto/update-time-state.dto';
import { GetTimeStateDto } from './dto/get-time-state.dto';
import { Between, Equal, FindManyOptions, Repository } from 'typeorm';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import TimeState from './time-state.entity';
import TimeStateNotFoundException from './exceptions/time-state-not-found.exception';

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
  async getAll(query: GetTimeStateDto) {
    const where: FindManyOptions<TimeState>['where'] = {};
    const { page, skip, limit } = query;
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    if (query.type) {
      where.type = Equal(query.type);
    }
    if (query.startDate) {
      where.createdAt = Between(query.startDate, query.endDate);
    }
    const [items, itemCount] = await this.timeStateRepository.findAndCount({
      where,
      order: {
        createdAt: 'DESC',
      },
      skip,
      take: limit,
    });
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a Option with a given id. Example:
   *
   * @example
   * const Option = await OptionService.getOptionById(1);
   */
  async getById(id: number): Promise<TimeState> {
    const timeState = await this.timeStateRepository.findOne({
      where: { id },
    });
    if (timeState) {
      return timeState;
    }
    throw new TimeStateNotFoundException(id);
  }

  /**
   *
   * @param Option createOption
   *
   */
  async create(dto: CreateTimeStateDto) {
    const newOption = this.timeStateRepository.create(dto);
    await this.timeStateRepository.save(newOption);
    return newOption;
  }

  /**
   * See the [definition of the UpdateOptionDto file]{@link UpdateOptionDto} to see a list of required properties
   */
  async updateById(id: number, dto: UpdateTimeStateDto): Promise<TimeState> {
    await this.timeStateRepository.update(id, dto);
    const updatedTimeState = await this.timeStateRepository.findOne({
      where: { id },
    });
    if (updatedTimeState) {
      return updatedTimeState;
    }
    throw new TimeStateNotFoundException(id);
  }
  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteTimeState(id: number): Promise<void> {
    const deleteResponse = await this.timeStateRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new TimeStateNotFoundException(id);
    }
  }
}
