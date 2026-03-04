import { Injectable } from '@nestjs/common';
import { CreateSystemMailDto } from './dto/create-system-mail.dto';
import { UpdateSystemMailDto } from './dto/update-system-mail.dto';
import { GetSystemMailDto } from './dto/get-system-mail.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import SystemMail from './system-mail.entity';
import SystemMailNotFoundException from './exceptions/system-mail-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/users/interface/user.interface';

@Injectable()
export class SystemMailService {
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
   * A method that fetches the Contract from the database
   * @returns A promise with the list of Contract
   */
  async getAllSystemMails(query: GetSystemMailDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<SystemMail>['where'] = {};
    if (query.userId) {
      where.userId = Equal(query.userId);
    }
    const page =
      query.page && !isNaN(query.page) && query.page > 0
        ? Number(query.page)
        : 1;
    const limit =
      query.limit && !isNaN(query.limit) && query.limit > 0
        ? Number(query.limit)
        : undefined;
    const skip = limit ? (page - 1) * limit : undefined;
    const [items, count] = await entityManager.findAndCount(SystemMail, {
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
   * A method that fetches a Access with a given id. Example:
   *
   * @example
   * const Access = await AccessService.getAccessById(1);
   */
  async getSystemMailById(
    systemMailId: number,
    user: IUser,
  ): Promise<SystemMail> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const systemMail = await entityManager.findOne(SystemMail, {
      where: { id: systemMailId },
    });
    if (systemMail) {
      return systemMail;
    }
    throw new SystemMailNotFoundException(systemMailId);
  }

  /**
   *
   * @param SystemMail createSystemMail
   *
   */
  async createSystemMail(systemMail: CreateSystemMailDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newSystemMail = entityManager.create(SystemMail, systemMail);
    await entityManager.save(newSystemMail);
    return newSystemMail;
  }

  /**
   * See the [definition of the UpdateContractDto file]{@link UpdateSystemMailDto} to see a list of required properties
   */
  async updateSystemMail(
    id: number,
    user: IUser,
    systemMail: UpdateSystemMailDto,
  ): Promise<SystemMail> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(SystemMail, id, systemMail);
    const updatedSystemMail = await entityManager.findOne(SystemMail, {
      where: { id: id },
    });
    if (updatedSystemMail) {
      return updatedSystemMail;
    }
    throw new SystemMailNotFoundException(id);
  }

  /**
   * @deprecated Use deleteContract instead
   */
  async deleteSystemMailById(id: number, user: IUser): Promise<void> {
    return this.deleteSystemMail(id, user);
  }

  /**
   * A method that deletes a contract from the database
   * @param id An id of a contract. A contract with this id should exist in the database
   */
  async deleteSystemMail(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(SystemMail, id);
    if (!deleteResponse.affected) {
      throw new SystemMailNotFoundException(id);
    }
  }
}
