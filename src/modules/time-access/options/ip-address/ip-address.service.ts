import { Injectable } from '@nestjs/common';
import { CreateIpAddressDto } from './dto/create-ip-address.dto';
import { UpdateIpSettingDto } from './dto/update-ip-address.dto';
import { GetIpAddressDto } from './dto/get-ip-address.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import IpAddress from './entity/ip-address.entity';
import IpAddressByusers from './entity/ip-byuser.entity';
import IpSettingNotFoundException from './exceptions/ip-address-not-found.exception';
import IpAddressByUsersNotFoundException from './exceptions/ip-address-byusers-not-found.exception';
import { PageDto } from '../../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../cloud/user/dto/get-user.dto';

@Injectable()
export class IpAddressService {
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
   * A method that fetches the IpSetting from the database
   * @returns A promise with the list of IpSettings
   */
  async getAllIpSetting(query: GetIpAddressDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<IpAddress>['where'] = {};
    if (query.comId) {
      where.comId = Equal(query.comId);
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
    const [items, count] = await entityManager.findAndCount(IpAddress, {
      where,
      order: {
        createdAt: 'DESC',
      },
      relations: ['ipAddressByusers'],
      skip: skip,
      take: limit,
    });
    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a IpSetting with a given id. Example:
   *
   * @example
   * const IpSetting = await IpSettingService.getIpSettingById(1);
   */
  async getIpSettingById(
    ipSettingId: number,
    user: GetUserDto,
  ): Promise<IpAddress> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const ipSetting = await entityManager.findOne(IpAddress, {
      where: { id: ipSettingId },
      relations: ['ipAddressByusers'],
    });
    if (ipSetting) {
      return ipSetting;
    }
    throw new IpSettingNotFoundException(ipSettingId);
  }

  /**
   *
   * @param IpSetting createIpSetting
   *
   */
  async createIpSetting(ipSetting: CreateIpAddressDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newIpSetting = entityManager.create(IpAddress, ipSetting);
    newIpSetting.autorId = user.id;
    newIpSetting.comId = user.companyId;
    await entityManager.save(newIpSetting);

    if (ipSetting.workerIds && ipSetting.workerIds.length > 0) {
      const ipAddressByUsers = ipSetting.workerIds.map((id) => {
        return entityManager.create(IpAddressByusers, {
          ipAddressId: newIpSetting.id,
          userId: id,
        });
      });
      await entityManager.save(IpAddressByusers, ipAddressByUsers);
    }
    return newIpSetting;
  }

  /**
   * See the [definition of the UpdateIpSettingDto file]{@link UpdateIpSettingDto} to see a list of required properties
   */
  async updateIpSetting(
    id: number,
    user: GetUserDto,
    ipSetting: UpdateIpSettingDto,
  ): Promise<IpAddress> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(IpAddress, id, ipSetting);

    if (ipSetting.workerIds && ipSetting.workerIds.length > 0) {
      await this.deleteIpByUsers(id, user);
      const ipAddressByUsers = ipSetting.workerIds.map((userId) => {
        return entityManager.create(IpAddressByusers, {
          ipAddressId: id,
          userId: userId,
        });
      });
      await entityManager.save(IpAddressByusers, ipAddressByUsers);
    }
    const updatedIpSetting = await entityManager.findOne(IpAddress, {
      where: { id: id },
    });
    if (updatedIpSetting) {
      return updatedIpSetting;
    }
    throw new IpSettingNotFoundException(id);
  }

  /**
   * @deprecated Use deleteIpSetting instead
   */
  async deleteIpSettingById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteIpSetting(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteIpSetting(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await this.deleteIpByUsers(id, user);
    const deleteResponse = await entityManager.delete(IpAddress, id);
    if (!deleteResponse.affected) {
      throw new IpSettingNotFoundException(id);
    }
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteIpByUsers(ipAddressId: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(IpAddressByusers, {
      ipAddressId: ipAddressId,
    });
    if (!deleteResponse.affected) {
      throw new IpAddressByUsersNotFoundException(ipAddressId);
    }
  }
}
