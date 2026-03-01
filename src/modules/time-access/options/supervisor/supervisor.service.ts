import { Injectable } from '@nestjs/common';
import { CreateSupervisorDto } from './dto/create-supervisor.dto';
import { UpdateSupervisorDto } from './dto/update-supervisor.dto';
import { GetSupervisorDto } from './dto/get-supervisor.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Supervisor from './entity/supervisor.entity';
import SupervisorByusers from './entity/supervisor-byuser.entity';
import SupervisorNotFoundException from './exceptions/supervisor-not-found.exception';
import SupervisorByUsersNotFoundException from './exceptions/supervisor-byusers-not-found.exception';
import { PageDto } from '../../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../cloud/user/dto/get-user.dto';

@Injectable()
export class SupervisorService {
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
  async getAllSupervisor(query: GetSupervisorDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Supervisor>['where'] = {};
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
    const [items, count] = await entityManager.findAndCount(Supervisor, {
      where,
      order: {
        id: 'DESC',
      },
      relations: ['supervisorByusers'],
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
   */
  async getSupervisorId(
    supervisorId: number,
    user: GetUserDto,
  ): Promise<Supervisor> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const supervisor = await entityManager.findOne(Supervisor, {
      where: { id: supervisorId },
      relations: ['supervisorByusers'],
    });
    if (supervisor) {
      return supervisor;
    }
    throw new SupervisorNotFoundException(supervisorId);
  }

  /**
   *
   * @param supervisor createSupervisor
   *
   */
  async createSupervisor(supervisor: CreateSupervisorDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newSupervisor = entityManager.create(Supervisor, supervisor);
    newSupervisor.autorId = user.id;
    newSupervisor.comId = user.companyId;
    await entityManager.save(newSupervisor);

    if (supervisor.workerIds && supervisor.workerIds.length > 0) {
      const supervisorByUsers = supervisor.workerIds.map((id) => {
        return entityManager.create(SupervisorByusers, {
          supervisorId: newSupervisor.id,
          userId: id,
        });
      });
      await entityManager.save(SupervisorByusers, supervisorByUsers);
    }
    return newSupervisor;
  }

  /**
   * See the [definition of the UpdateIpSettingDto file]{@link UpdateSupervisorDto} to see a list of required properties
   */
  async updateSupervisor(
    id: number,
    user: GetUserDto,
    supervisor: UpdateSupervisorDto,
  ): Promise<Supervisor> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Supervisor, id, supervisor);

    if (supervisor.workerIds && supervisor.workerIds.length > 0) {
      await this.deleteSupervisorByUsers(id, user);
      const supervisorByUsers = supervisor.workerIds.map((userId) => {
        return entityManager.create(SupervisorByusers, {
          supervisorId: id,
          userId: userId,
        });
      });
      await entityManager.save(SupervisorByusers, supervisorByUsers);
    }
    const updatedSupervisor = await entityManager.findOne(Supervisor, {
      where: { id: id },
    });
    if (updatedSupervisor) {
      return updatedSupervisor;
    }
    throw new SupervisorNotFoundException(id);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteSupervisor(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await this.deleteSupervisorByUsers(id, user);
    const deleteResponse = await entityManager.delete(Supervisor, id);
    if (!deleteResponse.affected) {
      throw new SupervisorNotFoundException(id);
    }
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteSupervisorByUsers(
    supervisorId: number,
    user: GetUserDto,
  ): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(SupervisorByusers, {
      supervisorId: supervisorId,
    });
    if (!deleteResponse.affected) {
      throw new SupervisorByUsersNotFoundException(supervisorId);
    }
  }
}
