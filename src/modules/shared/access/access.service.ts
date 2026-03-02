import { Injectable } from '@nestjs/common';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import { GetAccessDto } from './dto/get-access.dto';
import { getEntityManagerToken, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Equal, FindManyOptions, Repository } from 'typeorm';
import AccessNotFoundException from './exceptions/access-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import UserLimit from './entities/user-limit.entity';

@Injectable()
export class SharedAccessService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(UserLimit)
    private userLimitRepository: Repository<UserLimit>,
    private moduleRef: ModuleRef,
  ) {}

  private async loadEntityManager(systemId: string): Promise<EntityManager> {
    return this.moduleRef.get(getEntityManagerToken(`ioffice_${systemId}`), {
      strict: false,
    });
  }

  /**
   * A method that fetches the Access from the database
   * @returns A promise with the list of Accesss
   */
  async getAllAccesss(query: GetAccessDto) {
    const where: FindManyOptions<UserLimit>['where'] = {};

    if (query.itemId) {
      where.itemId = Equal(query.itemId);
    }

    if (query.userId) {
      where.userId = Equal(query.userId);
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

    const [items, count] = await this.userLimitRepository.findAndCount({
      where,
      order: {
        createdAt: 'DESC',
      },
      skip,
      take: limit,
    });

    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a Access with a given id. Example:
   *
   * @example
   * const Access = await AccessService.getAccessById(1);
   */
  async getAccessById(accessId: number): Promise<UserLimit> {
    const access = await this.userLimitRepository.findOne({
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
  async createAccess(access: CreateAccessDto) {
    const newAccess = this.userLimitRepository.create(access);
    return await this.userLimitRepository.save(newAccess);
  }

  /**
   * See the [definition of the UpdateAccessDto file]{@link UpdateAccessDto} to see a list of required properties
   */
  async updateAccess(id: number, access: UpdateAccessDto): Promise<UserLimit> {
    await this.userLimitRepository.update(id, access);
    const updatedAccess = await this.userLimitRepository.findOne({
      where: { id },
    });
    if (updatedAccess) {
      return updatedAccess;
    }
    throw new AccessNotFoundException(id);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteAccess(id: number): Promise<void> {
    const deleteResponse = await this.userLimitRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new AccessNotFoundException(id);
    }
  }
}
