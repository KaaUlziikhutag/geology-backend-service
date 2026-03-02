import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAbovetDto } from './dto/create-above.dto';
import { UpdateAboveDto } from './dto/update-above.dto';
import { GetAboveDto } from './dto/get-above.dto';
import { EntityManager, Equal, FindManyOptions, In, Not } from 'typeorm';
import Above from './above.entity';
import AboveNotFoundException from './exceptions/above-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import Trees from '../../human-resource/tree/tree.entity';
import Worker from '../../human-resource/member/worker/worker.entity';
import { AccessType, ContractState } from '@utils/enum-utils';
import DecisionViewUser from '../view-users/view-users.entity';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class AboveService {
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
   * A method that fetches the Above from the database
   * @returns A promise with the list of Above
   */
  async getAllAboves(query: GetAboveDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Above>['where'] = {};
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    if (query.state) {
      where.state = Equal(query.state);
    }
    if (query.parentId) {
      where.id = Not(query.parentId);
    }
    if (query.typeId) {
      where.typeId = Equal(query.typeId);
    }
    if (query.accessType == AccessType.Simple) {
      where.workers = [{ id: Equal(user.id) }];
    }

    if (query.workerId) {
      where.workers = {
        id: Equal(query.workerId),
      };
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
    const [items, count] = await entityManager.findAndCount(Above, {
      where,
      order: {
        createdAt: 'DESC',
      },
      relations: ['types', 'parent', 'children'],
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
  async getAboveById(aboveId: number, user: IUser): Promise<Above> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const above = await entityManager.findOne(Above, {
      where: { id: aboveId },
      relations: [
        'trees',
        'workers',
        'workers.humans',
        'workers.appTree',
        'types',
        'parent',
        'children',
        'categoryOrganization',
        'viewUsers',
        'viewUsers.workers',
        'viewUsers.workers.humans',
        'viewUsers.workers.appTree',
        'supervisorAboveWorkers',
        'supervisorAboveWorkers.humans',
        'supervisorAboveWorkers.appTree',
        'implementationWiths',
        'implementationWiths.humans',
        'implementationWiths.appTree',
      ],
    });
    if (above) {
      return above;
    }
    throw new AboveNotFoundException(aboveId);
  }

  /**
   *
   * @param Above createAbove
   *
   */
  async createAbove(above: CreateAbovetDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    above.authorId = user.id;
    above.comId = null;

    if (above.voidContract) {
      await entityManager.update(Above, above.voidContract, {
        state: ContractState.Cancelled,
      });
    }
    if (above.number) {
      const existingAbove = await entityManager.findOne(Above, {
        where: { number: above.number },
      });
      if (existingAbove) {
        throw new BadRequestException(
          `"${above.number}" тоот тушаал, шийдвэрийн дугаар өмнө бүртгэгдсэн байна.`,
        );
      }
    }

    if (above.treeIds && above.treeIds.length > 0) {
      const trees = await entityManager.find(Trees, {
        where: { id: In(above.treeIds) },
      });
      if (!trees || trees.length !== above.treeIds.length) {
        throw new Error('Some of the treeIds are invalid');
      }
      above.trees = trees;
    }
    if (above.workerIds && above.workerIds.length > 0) {
      const workers = await entityManager.find(Worker, {
        where: { id: In(above.workerIds) },
      });
      if (!workers || workers.length !== above.workerIds.length) {
        throw new Error('Some of the workerIds are invalid');
      }
      above.workers = workers;
    }
    if (above.supervisorIds && above.supervisorIds.length > 0) {
      const supervisorAboveWorkers = await entityManager.find(Worker, {
        where: { id: In(above.supervisorIds) },
      });
      if (
        !supervisorAboveWorkers ||
        supervisorAboveWorkers.length !== above.supervisorIds.length
      ) {
        throw new Error('Some of the workerIds are invalid');
      }
      above.supervisorAboveWorkers = supervisorAboveWorkers;
    }
    if (above.implementationWithIds && above.implementationWithIds.length > 0) {
      const implementationWiths = await entityManager.find(Worker, {
        where: { id: In(above.implementationWithIds) },
      });
      if (
        !implementationWiths ||
        implementationWiths.length !== above.implementationWithIds.length
      ) {
        throw new Error('Some of the workerIds are invalid');
      }
      above.implementationWiths = implementationWiths;
    }
    const newAbove = entityManager.create(Above, above);
    await entityManager.save(newAbove);
    if (above.viewUserIds) {
      for (const id of above.viewUserIds) {
        const newAppointmentByuser = await entityManager.create(
          DecisionViewUser,
          {
            aboveId: newAbove.id,
            userId: id,
          },
        );
        await entityManager.save(newAppointmentByuser);
      }
    }
    return newAbove;
  }

  /**
   * See the [definition of the UpdateAboveDto file]{@link UpdateAboveDto} to see a list of required properties
   */
  async updateAbove(
    id: number,
    user: IUser,
    above: UpdateAboveDto,
  ): Promise<Above> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    if (above.number) {
      const existingsAbove = await entityManager.findOne(Above, {
        where: { number: above.number, id: Not(id) },
      });
      if (existingsAbove) {
        throw new BadRequestException(
          `"${above.number}" тоот тушаал, шийдвэрийн дугаар өмнө бүртгэгдсэн байна.`,
        );
      }
    }
    if (!above.isNotVoid) {
      if (above.voidContract) {
        await entityManager.update(Above, above.voidContract, {
          state: ContractState.Cancelled,
        });
      } else {
        const aboveVoid = await entityManager.findOne(Above, {
          where: { id: id },
        });
        if (aboveVoid?.voidContract) {
          await entityManager.update(Above, aboveVoid?.voidContract, {
            state: ContractState.Active,
          });
        }
      }
    }
    const existingAbove = await entityManager.findOne(Above, {
      where: { id: id, comId: null },
      relations: ['trees', 'workers'],
    });
    if (!existingAbove) {
      throw new AboveNotFoundException(id);
    }
    if (above.treeIds && above.treeIds.length > 0) {
      const trees = await entityManager.find(Trees, {
        where: { id: In(above.treeIds) },
      });
      if (!trees || trees.length !== above.treeIds.length) {
        throw new Error('Some of the treeIds are invalid');
      }
      above.trees = trees;
    }
    if (above.workerIds && above.workerIds.length > 0) {
      const workers = await entityManager.find(Worker, {
        where: { id: In(above.workerIds) },
      });
      if (!workers || workers.length !== above.workerIds.length) {
        throw new Error('Some of the workerIds are invalid');
      }
      above.workers = workers;
    }
    if (above.supervisorIds && above.supervisorIds.length > 0) {
      const supervisorAboveWorkers = await entityManager.find(Worker, {
        where: { id: In(above.supervisorIds) },
      });
      if (
        !supervisorAboveWorkers ||
        supervisorAboveWorkers.length !== above.supervisorIds.length
      ) {
        throw new Error('Some of the workerIds are invalid');
      }
      above.supervisorAboveWorkers = supervisorAboveWorkers;
    }
    if (above.implementationWithIds && above.implementationWithIds.length > 0) {
      const implementationWiths = await entityManager.find(Worker, {
        where: { id: In(above.implementationWithIds) },
      });
      if (
        !implementationWiths ||
        implementationWiths.length !== above.implementationWithIds.length
      ) {
        throw new Error('Some of the workerIds are invalid');
      }
      above.implementationWiths = implementationWiths;
    }
    if (above.viewUserIds) {
      await entityManager.delete(DecisionViewUser, {
        aboveId: existingAbove.id,
      });
      for (const id of above.viewUserIds) {
        const newAppointmentByuser = entityManager.create(DecisionViewUser, {
          aboveId: existingAbove.id,
          userId: id,
        });
        await entityManager.save(newAppointmentByuser);
      }
    }
    Object.assign(existingAbove, above);
    await entityManager.save(existingAbove);
    return existingAbove;
  }

  /**
   * @deprecated Use deleteAbove instead
   */
  async deleteAboveById(id: number, user: IUser): Promise<void> {
    return this.deleteAbove(id, user);
  }

  /**
   * A method that deletes a Above from the database
   * @param id An id of a Above. A Above with this id should exist in the database
   */
  async deleteAbove(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Above, id);
    if (!deleteResponse.affected) {
      throw new AboveNotFoundException(id);
    }
  }
}
