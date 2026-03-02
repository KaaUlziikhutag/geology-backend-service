import { Injectable } from '@nestjs/common';
import { GetAgreeByuserDto } from './dto/get-agree-byuser.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import AgreeByusers from './agree-byuser.entity';
import AgreeByuserNotFoundException from './exceptions/agree-byuser-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { UserIdsDto } from './dto/create-agree-byuser.dto';
import { UpdateAgreeByuserDto } from './dto/update-agree-byuser.dto';
import { IUser } from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class AgreeByuserService {
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
   * A method that fetches the AgreeByuser from the database
   * @returns A promise with the list of AgreeByusers
   */
  async getAllAgreeByuser(query: GetAgreeByuserDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<AgreeByusers>['where'] = {};
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
        : 10;
    const skip = (page - 1) * limit;
    const [items, count] = await entityManager.findAndCount(AgreeByusers, {
      where,
      order: {
        createdAt: 'DESC',
      },
      relations: ['workers', 'workers.humans'],
      skip: skip,
      take: limit,
    });
    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a AgreeByuser with a given id. Example:
   *
   * @example
   * const AgreeByuser = await AgreeByuserService.getAgreeByuserById(1);
   */
  async getAgreeByuserById(
    agreeByuserId: number,
    user: IUser,
  ): Promise<AgreeByusers> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const agreeByuser = await entityManager.findOne(AgreeByusers, {
      where: { id: agreeByuserId },
      relations: ['workers', 'workers.humans'],
    });
    if (agreeByuser) {
      return agreeByuser;
    }
    throw new AgreeByuserNotFoundException(agreeByuserId);
  }

  /**
   *
   * @param AgreeByuser createAgreeByuser
   *
   */
  async createUsers(userData: UserIdsDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.transaction(async (transactionalEntityManager) => {
      const agreeUsers = userData.userIds.map((id) =>
        transactionalEntityManager.create(AgreeByusers, {
          userId: id,
          comId: null,
          autorId: userData.autorId,
        }),
      );

      await transactionalEntityManager.save(agreeUsers);
    });
  }

  async updateAgreeByUser(
    agreeById: number,
    user: IUser,
    agreeByUser: UpdateAgreeByuserDto,
  ) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.transaction(async (transactionalEntityManager) => {
      await Promise.all(
        agreeByUser.userIds.map(async (userId) => {
          await transactionalEntityManager.update(
            AgreeByusers,
            { userId, comId: null },
            agreeByUser,
          );
        }),
      );
    });
    const updatedAgreeByUsers = await entityManager.find(AgreeByusers, {
      where: { id: agreeById },
    });
    if (updatedAgreeByUsers.length > 0) {
      return updatedAgreeByUsers;
    }
    throw new AgreeByuserNotFoundException(agreeById);
  }

  /**
   * @deprecated Use deleteAgreeByuser instead
   */
  async deleteAgreeByuserById(id: number, user: IUser): Promise<void> {
    return this.deleteAgreeByuser(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteAgreeByuser(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(AgreeByusers, id);
    if (!deleteResponse.affected) {
      throw new AgreeByuserNotFoundException(id);
    }
  }
}
