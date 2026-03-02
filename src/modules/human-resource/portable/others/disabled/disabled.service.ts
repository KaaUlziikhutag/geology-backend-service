import { Injectable } from '@nestjs/common';
import { CreateDisabledDto } from './dto/create-disabled.dto';
import { UpdateDisabledDto } from './dto/update-disabled.dto';
import { GetDisabledDto } from './dto/get-disabled.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Disabled from './disabled.entity';
import DisabledNotFoundException from './exceptions/disabled-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class DisabledService {
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
   * A method that fetches the Disabled from the database
   * @returns A promise with the list of Disableds
   */
  async getAllDisableds(query: GetDisabledDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Disabled>['where'] = {};
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    if (query.workerId) {
      where.workerId = Equal(query.workerId);
    }
    const [items, count] = await entityManager.findAndCount(Disabled, {
      where,
      order: {
        createdAt: 'DESC',
      },
      skip: query.skip,
      take: query.limit,
    });

    const page = Number(query.page);
    const limit = Number(query.limit);
    const itemCount = count;

    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });

    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a Disabled with a given id. Example:
   *
   * @example
   * const Disabled = await DisabledService.getDisabledById(1);
   */
  async getDisabledById(disabledId: number, user: IUser): Promise<Disabled> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const disabled = await entityManager.findOne(Disabled, {
      where: { id: disabledId },
    });
    if (disabled) {
      return disabled;
    }
    throw new DisabledNotFoundException(disabledId);
  }

  /**
   *
   * @param Disabled createDisabled
   *
   */
  async createDisabled(disabled: CreateDisabledDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    disabled.authorId = user.id;
    const newDisabled = entityManager.create(Disabled, disabled);
    await entityManager.save(newDisabled);
    return newDisabled;
  }

  /**
   * See the [definition of the UpdateDisabledDto file]{@link UpdateDisabledDto} to see a list of required properties
   */
  async updateDisabled(
    id: number,
    user: IUser,
    disabled: UpdateDisabledDto,
  ): Promise<Disabled> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Disabled, id, disabled);
    const updatedDisabled = await entityManager.findOne(Disabled, {
      where: { id: id },
    });
    if (updatedDisabled) {
      return updatedDisabled;
    }
    throw new DisabledNotFoundException(id);
  }

  /**
   * @deprecated Use deleteDisabled instead
   */
  async deleteDisabledById(id: number, user: IUser): Promise<void> {
    return this.deleteDisabled(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteDisabled(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Disabled, id);
    if (!deleteResponse.affected) {
      throw new DisabledNotFoundException(id);
    }
  }
}
