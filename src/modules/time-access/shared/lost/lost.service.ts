import { Injectable } from '@nestjs/common';
import { CreateDirectLostDto } from './dto/create-lost.dto';
import { UpdateDirectLostDto } from './dto/update-lost.dto';
import { GetDirectLostDto } from './dto/get-lost.dto';
import { Equal, FindManyOptions, Repository } from 'typeorm';
import DirectLosts from './lost.entity';
import DirectLostNotFoundException from './exceptions/lost-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DirectLostService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(DirectLosts)
    private readonly directLostRepository: Repository<DirectLosts>,
  ) {}

  /**
   * A method that fetches the DirectLost from the database
   * @returns A promise with the list of DirectLosts
   */
  async getAllDirectLosts(query: GetDirectLostDto) {
    const where: FindManyOptions<DirectLosts>['where'] = {};
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
    const [items, count] = await this.directLostRepository.findAndCount({
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
   * A method that fetches a DirectLost with a given id. Example:
   *
   * @example
   * const DirectLost = await DirectLostService.getDirectLostById(1);
   */
  async getDirectLostById(directLostId: number): Promise<DirectLosts> {
    const directLost = await this.directLostRepository.findOne({
      where: { id: directLostId },
    });
    if (directLost) {
      return directLost;
    }
    throw new DirectLostNotFoundException(directLostId);
  }

  /**
   *
   * @param DirectLost createDirectLost
   *
   */
  async createDirectLost(directLost: CreateDirectLostDto) {
    const newDirectLost = this.directLostRepository.create(directLost);
    return await this.directLostRepository.save(newDirectLost);
  }

  /**
   * See the [definition of the UpdateDirectLostDto file]{@link UpdateDirectLostDto} to see a list of required properties
   */
  async updateDirectLost(
    id: number,
    directLost: UpdateDirectLostDto,
  ): Promise<DirectLosts> {
    await this.directLostRepository.update(id, directLost);
    const updatedDirectLost = await this.directLostRepository.findOne({
      where: { id },
    });
    if (updatedDirectLost) {
      return updatedDirectLost;
    }
    throw new DirectLostNotFoundException(id);
  }

  /**
   * @deprecated Use deleteDirectLost instead
   */
  async deleteDirectLostById(id: number): Promise<void> {
    return this.deleteDirectLost(id);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteDirectLost(id: number): Promise<void> {
    const deleteResponse = await this.directLostRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new DirectLostNotFoundException(id);
    }
  }
}
