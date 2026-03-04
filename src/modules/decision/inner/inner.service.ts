import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInnerDto } from './dto/create-inner.dto';
import { UpdateInnerDto } from './dto/update-inner.dto';
import { GetInnerDto } from './dto/get-inner.dto';
import {
  Between,
  EntityManager,
  Equal,
  FindManyOptions,
  In,
  Not,
} from 'typeorm';
import Inner from './inner.entity';
import InnerNotFoundException from './exceptions/inner-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { AccessType, ContractState, InnerDateType } from '@utils/enum-utils';
import Trees from '../../human-resource/tree/tree.entity';
import Worker from '../../human-resource/member/worker/worker.entity';
import DecisionViewUser from '../view-users/view-users.entity';
import IUser from '@modules/users/interface/user.interface';

@Injectable()
export class InnerService {
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
  async getAllInners(query: GetInnerDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Inner>['where'] = {};
    if (query.type == InnerDateType.OwnDate) {
      where.ownDate = Between(query.startDate, query.endDate);
    }
    if (query.type == InnerDateType.EndDate) {
      where.excDate = Between(query.startDate, query.endDate);
    }
    if (query.workerId) {
      where.workers = {
        id: Equal(query.workerId),
      };
    }
    if (query.accessType == AccessType.Simple) {
      where.workers = [{ id: Equal(user.id) }];
    }

    if (query.type == InnerDateType.EndDate) {
      where.endDate = Between(query.startDate, query.endDate);
    }
    if (query.type == InnerDateType.SendDate) {
      where.sendDate = Between(query.startDate, query.endDate);
    }
    if (query.type == InnerDateType.AnsweredDate) {
      where.answeredDate = Between(query.startDate, query.endDate);
    }
    if (query.parentId) {
      where.id = Not(query.parentId);
    }
    if (query.type == InnerDateType.CreatedAt) {
      where.createdAt = Between(query.startDate, query.endDate);
    }
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    if (query.state) {
      where.state = Equal(query.state);
    }
    if (query.typeId) {
      where.typeId = Equal(query.typeId);
    }
    if (query.authorId) {
      where.authorId = Equal(query.authorId);
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
    const [items, count] = await entityManager.findAndCount(Inner, {
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
  async getInnerById(innerId: number, user: IUser): Promise<Inner> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const inner = await entityManager.findOne(Inner, {
      where: { id: innerId },
      relations: [
        'trees',
        'workers',
        'workers.humans',
        'workers.appTree',
        'viewUsers',
        'viewUsers.workers',
        'viewUsers.workers.humans',
        'viewUsers.workers.appTree',
        'types',
        'parent',
        'children',
        'signWorkers',
        'signWorkers.humans',
        'signWorkers.appTree',
        'authorInnerWorkers',
        'authorInnerWorkers.humans',
        'authorInnerWorkers.appTree',
        'confirmInnerWorker',
        'confirmInnerWorker.humans',
        'confirmInnerWorker.appTree',
        'supervisorInnerWorkers',
        'supervisorInnerWorkers.humans',
        'supervisorInnerWorkers.appTree',
        'implementationWiths',
        'implementationWiths.humans',
        'implementationWiths.appTree',
      ],
    });

    if (inner) {
      return inner;
    }
    throw new InnerNotFoundException(innerId);
  }

  /**
   *
   * @param Contract createContract
   *
   */
  async createInner(inner: CreateInnerDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    inner.comId = null;
    const existingInner = await entityManager.findOne(Inner, {
      where: { number: inner.number },
    });
    if (existingInner) {
      throw new BadRequestException(
        `"${existingInner.number}" тоот тушаал, шийдвэрийн дугаар өмнө бүртгэгдсэн байна.`,
      );
    }
    if (inner.voidContract) {
      await entityManager.update(Inner, inner.voidContract, {
        state: ContractState.Cancelled,
      });
    }
    if (inner.treeIds && inner.treeIds.length > 0) {
      const trees = await entityManager.find(Trees, {
        where: { id: In(inner.treeIds) },
      });
      if (!trees || trees.length !== inner.treeIds.length) {
        throw new Error('Some of the treeIds are invalid');
      }
      inner.trees = trees;
    }
    if (inner.workerIds && inner.workerIds.length > 0) {
      const workers = await entityManager.find(Worker, {
        where: { id: In(inner.workerIds) },
      });
      if (!workers || workers.length !== inner.workerIds.length) {
        throw new Error('Some of the workerIds are invalid');
      }
      inner.workers = workers;
    }
    if (inner.supervisorIds && inner.supervisorIds.length > 0) {
      const supervisorInnerWorkers = await entityManager.find(Worker, {
        where: { id: In(inner.supervisorIds) },
      });
      if (
        !supervisorInnerWorkers ||
        supervisorInnerWorkers.length !== inner.supervisorIds.length
      ) {
        throw new Error('Some of the supervisorInnerWorkers are invalid');
      }
      inner.supervisorInnerWorkers = supervisorInnerWorkers;
    }
    if (inner.implementationWithIds && inner.implementationWithIds.length > 0) {
      const implementationWiths = await entityManager.find(Worker, {
        where: { id: In(inner.implementationWithIds) },
      });
      if (
        !implementationWiths ||
        implementationWiths.length !== inner.implementationWithIds.length
      ) {
        throw new Error('Some of the workerIds are invalid');
      }
      inner.implementationWiths = implementationWiths;
    }
    if (inner.authorUserIds && inner.authorUserIds.length > 0) {
      const authorInnerWorkers = await entityManager.find(Worker, {
        where: { id: In(inner.authorUserIds) },
      });
      if (
        !authorInnerWorkers ||
        authorInnerWorkers.length !== inner.authorUserIds.length
      ) {
        throw new Error('Some of the workerIds are invalid');
      }
      inner.authorInnerWorkers = authorInnerWorkers;
    }
    if (inner.signUserIds && inner.signUserIds.length > 0) {
      const signWorkers = await entityManager.find(Worker, {
        where: { id: In(inner.signUserIds) },
      });
      if (!signWorkers || signWorkers.length !== inner.signUserIds.length) {
        throw new Error('Some of the workerIds are invalid');
      }
      inner.signWorkers = signWorkers;
    }
    const newInner = await entityManager.create(Inner, inner);
    await entityManager.save(newInner);
    if (inner.viewUserIds) {
      for (const id of inner.viewUserIds) {
        const newAppointmentByuser = await entityManager.create(
          DecisionViewUser,
          {
            innerId: newInner.id,
            userId: id,
          },
        );
        await entityManager.save(newAppointmentByuser);
      }
    }

    return newInner;
  }

  /**
   * See the [definition of the UpdateContractDto file]{@link UpdateInnerDto} to see a list of required properties
   */
  async updateInner(
    id: number,
    user: IUser,
    inner: UpdateInnerDto,
  ): Promise<Inner> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const existingInner = await entityManager.findOne(Inner, {
      where: { id: id, comId: null },
      relations: ['trees', 'workers'], // Make sure to load related entities
    });
    if (!existingInner) {
      throw new InnerNotFoundException(id);
    }
    if (inner.number) {
      const existingInners = await entityManager.findOne(Inner, {
        where: { number: inner.number, id: Not(id) },
      });
      if (existingInners) {
        throw new BadRequestException(
          `"${inner.number}" тоот тушаал, шийдвэрийн дугаар өмнө бүртгэгдсэн байна.`,
        );
      }
    }
    if (!inner.isNotVoid) {
      console.log('isNotVoid', inner.isNotVoid);
      if (inner.voidContract) {
        await entityManager.update(Inner, inner.voidContract, {
          state: ContractState.Cancelled,
        });
      } else {
        const innerVoid = await entityManager.findOne(Inner, {
          where: { id: id },
        });
        if (innerVoid?.voidContract) {
          await entityManager.update(Inner, innerVoid?.voidContract, {
            state: ContractState.Active,
          });
        }
      }
    }

    if (inner.treeIds && inner.treeIds.length > 0) {
      const trees = await entityManager.find(Trees, {
        where: { id: In(inner.treeIds) },
      });
      if (!trees || trees.length !== inner.treeIds.length) {
        throw new Error('Some of the treeIds are invalid');
      }
      inner.trees = trees;
    }
    if (inner.workerIds && inner.workerIds.length > 0) {
      const workers = await entityManager.find(Worker, {
        where: { id: In(inner.workerIds) },
      });
      if (!workers || workers.length !== inner.workerIds.length) {
        throw new Error('Some of the workerIds are invalid');
      }
      inner.workers = workers;
    }
    if (inner.supervisorIds && inner.supervisorIds.length > 0) {
      const supervisorInnerWorkers = await entityManager.find(Worker, {
        where: { id: In(inner.supervisorIds) },
      });
      if (
        !supervisorInnerWorkers ||
        supervisorInnerWorkers.length !== inner.supervisorIds.length
      ) {
        throw new Error('Some of the workerIds are invalid');
      }
      inner.supervisorInnerWorkers = supervisorInnerWorkers;
    }
    if (inner.implementationWithIds && inner.implementationWithIds.length > 0) {
      const implementationWiths = await entityManager.find(Worker, {
        where: { id: In(inner.implementationWithIds) },
      });
      if (
        !implementationWiths ||
        implementationWiths.length !== inner.implementationWithIds.length
      ) {
        throw new Error('Some of the workerIds are invalid');
      }
      inner.implementationWiths = implementationWiths;
    }
    if (inner.authorUserIds && inner.authorUserIds.length > 0) {
      const authorInnerWorkers = await entityManager.find(Worker, {
        where: { id: In(inner.authorUserIds) },
      });
      if (
        !authorInnerWorkers ||
        authorInnerWorkers.length !== inner.authorUserIds.length
      ) {
        throw new Error('Some of the workerIds are invalid');
      }
      inner.authorInnerWorkers = authorInnerWorkers;
    }
    if (inner.signUserIds && inner.signUserIds.length > 0) {
      const signWorkers = await entityManager.find(Worker, {
        where: { id: In(inner.signUserIds) },
      });
      if (!signWorkers || signWorkers.length !== inner.signUserIds.length) {
        throw new Error('Some of the workerIds are invalid');
      }
      inner.signWorkers = signWorkers;
    }

    if (inner.viewUserIds) {
      await entityManager.delete(DecisionViewUser, {
        innerId: existingInner.id,
      });
      for (const id of inner.viewUserIds) {
        const newAppointmentByuser = entityManager.create(DecisionViewUser, {
          innerId: existingInner.id,
          userId: id,
        });
        await entityManager.save(newAppointmentByuser);
      }
    }
    Object.assign(existingInner, inner);
    await entityManager.save(existingInner);
    return existingInner;
  }

  /**
   * @deprecated Use deleteContract instead
   */
  async deleteInnerById(id: number, user: IUser): Promise<void> {
    return this.deleteInner(id, user);
  }

  /**
   * A method that deletes a contract from the database
   * @param id An id of a contract. A contract with this id should exist in the database
   */
  async deleteInner(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Inner, id);
    if (!deleteResponse.affected) {
      throw new InnerNotFoundException(id);
    }
  }
}
