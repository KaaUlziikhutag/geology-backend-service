import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEmploymentContractDto } from './dto/create-employment.dto';
import { UpdateEmploymentContractDto } from './dto/update-employment.dto';
import { GetEmploymentContractDto } from './dto/get-employment.dto';
import {
  Between,
  EntityManager,
  Equal,
  FindManyOptions,
  In,
  Not,
} from 'typeorm';
import EmploymentContract from './employment.entity';
import EmploymentContractNotFoundException from './exceptions/employment-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/users/interface/user.interface';
import ContractViewUser from '../../../contract/view-users/view-users.entity';
import { AccessType, ContractState, DateType } from '@utils/enum-utils';
import Trees from '../../../human-resource/tree/tree.entity';

@Injectable()
export class EmploymentContractService {
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
   * A method that fetches the EmploymentContract from the database
   * @returns A promise with the list of EmploymentContract

   */
  async getAllEmploymentContracts(
    query: GetEmploymentContractDto,
    user: IUser,
  ) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<EmploymentContract>['where'] = {};
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    if (query.workerId) {
      where.workerId = Equal(query.workerId);
    }
    if (query.typeId) {
      where.typeId = Equal(query.typeId);
    }
    if (query.parentId) {
      where.id = Not(query.parentId);
    }
    if (query.state) {
      where.state = Equal(query.state);
    }
    if (query.startDate) {
      query.startDate.setHours(0, 0, 0, 0);
      query.endDate.setHours(23, 59, 59, 999);
    }
    if (query.type == DateType.Start) {
      where.addDate = Between(query.startDate, query.endDate);
    }
    if (query.type == DateType.End) {
      where.endDate = Between(query.startDate, query.endDate);
    }
    if (query.type == DateType.Create) {
      where.createdAt = Between(query.startDate, query.endDate);
    }
    if (query.type == DateType.contractCreate) {
      where.contractCreateDate = Between(query.startDate, query.endDate);
    }

    if (query.accessType == AccessType.Simple) {
      // where.workers = [{ id: Equal(user.workerId) }];
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
    const [items, count] = await entityManager.findAndCount(
      EmploymentContract,
      {
        where,
        order: {
          createdAt: 'DESC',
        },
        relations: [
          'type',
          'children',
          'parent',
          'viewUsers',
          'workers',
          'workers.humans',
          'workers.appTree',
        ],
        skip: skip,
        take: limit,
      },
    );
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
  async getEmploymentContractById(
    employmentContractId: number,
    user: IUser,
  ): Promise<EmploymentContract> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const employmentContract = await entityManager.findOne(EmploymentContract, {
      where: { id: employmentContractId },
      relations: [
        'type',
        'workers',
        'workers.humans',
        'trees',
        'tree',
        'parent',
        'children',
        'viewUsers',
        'viewUsers.worker',
        'viewUsers.worker.appTree',
        'viewUsers.worker.humans',
        'ourConfirmWorker',
        'ourConfirmWorker.humans',
      ],
    });
    if (employmentContract) {
      return employmentContract;
    }
    throw new EmploymentContractNotFoundException(employmentContractId);
  }

  /**
   *
   * @param EmploymentContract createEmploymentContract
   *
   */

  async createEmploymentContract(
    employmentContract: CreateEmploymentContractDto,
    user: IUser,
  ) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    employmentContract.authorId = user.id;
    const existingEmploymentContract = await entityManager.findOne(
      EmploymentContract,
      {
        where: { number: employmentContract.number },
      },
    );
    if (existingEmploymentContract) {
      throw new BadRequestException(
        `"${employmentContract.number}" тоот гэрээний дугаар өмнө бүртгэгдсэн байна.`,
      );
    }

    if (employmentContract.voidContract) {
      await entityManager.update(
        EmploymentContract,
        employmentContract.voidContract,
        {
          state: ContractState.Cancelled,
        },
      );
    }
    if (employmentContract.treeIds && employmentContract.treeIds.length > 0) {
      const trees = await entityManager.find(Trees, {
        where: { id: In(employmentContract.treeIds) },
      });
      if (!trees || trees.length !== employmentContract.treeIds.length) {
        throw new Error('Some of the treeIds are invalid');
      }
      employmentContract.trees = trees;
    }
    const newEmploymentContract = entityManager.create(
      EmploymentContract,
      employmentContract,
    );
    await entityManager.save(newEmploymentContract);
    if (
      employmentContract.viewUserIds &&
      employmentContract.viewUserIds.length > 0
    ) {
      const employmentContractViewUsers = employmentContract.viewUserIds.map(
        (id) => {
          return entityManager.create(ContractViewUser, {
            employmentId: (newEmploymentContract as EmploymentContract).id,
            userId: id,
          });
        },
      );
      await entityManager.save(ContractViewUser, employmentContractViewUsers);
    }

    return newEmploymentContract;
  }

  /**
   * See the [definition of the UpdateEmploymentContractDto file]{@link UpdateEmploymentContractDto} to see a list of required properties
   */
  async updateEmploymentContract(
    id: number,
    user: IUser,
    employmentContract: UpdateEmploymentContractDto,
  ): Promise<EmploymentContract> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    if (employmentContract.number) {
      const existingEmploymentContract = await entityManager.findOne(
        EmploymentContract,
        {
          where: { number: employmentContract.number, id: Not(id) },
        },
      );
      if (existingEmploymentContract) {
        throw new BadRequestException(
          `"${employmentContract.number}" тоот гэрээний дугаар өмнө бүртгэгдсэн байна.`,
        );
      }
    }
    if (!employmentContract.isNotVoid) {
      if (employmentContract.voidContract) {
        await entityManager.update(
          EmploymentContract,
          employmentContract.voidContract,
          {
            state: ContractState.Cancelled,
          },
        );
      } else {
        const contractVoid = await entityManager.findOne(EmploymentContract, {
          where: { id: id },
        });
        if (contractVoid?.voidContract) {
          await entityManager.update(
            EmploymentContract,
            contractVoid.voidContract,
            {
              state: ContractState.Active,
            },
          );
        }
      }
    }
    const existingEmploymentContract = await entityManager.findOne(
      EmploymentContract,
      {
        where: { id: id },
        relations: ['trees'],
      },
    );
    if (!existingEmploymentContract) {
      throw new EmploymentContractNotFoundException(id);
    }

    if (employmentContract.treeIds && employmentContract.treeIds.length > 0) {
      const trees = await entityManager.find(Trees, {
        where: { id: In(employmentContract.treeIds) },
      });
      if (!trees || trees.length !== employmentContract.treeIds.length) {
        throw new Error('Some of the treeIds are invalid');
      }
      employmentContract.trees = trees;
    }
    const updatedEmploymentContract = await entityManager.findOne(
      EmploymentContract,
      {
        where: { id: id },
      },
    );
    if (!updatedEmploymentContract) {
      throw new EmploymentContractNotFoundException(id);
    }
    if (
      employmentContract.viewUserIds &&
      employmentContract.viewUserIds.length > 0
    ) {
      await entityManager.delete(ContractViewUser, { employmentId: id });
      const contractViewUsers = employmentContract.viewUserIds.map(
        (workerId) => {
          return entityManager.create(ContractViewUser, {
            employmentId: id,
            userId: workerId,
          });
        },
      );
      await entityManager.save(ContractViewUser, contractViewUsers);
    }
    Object.assign(existingEmploymentContract, employmentContract);
    await entityManager.save(existingEmploymentContract);
    return existingEmploymentContract;
  }

  /**
   * @deprecated Use deleteEmploymentContract instead
   */
  async deleteEmploymentContractById(id: number, user: IUser): Promise<void> {
    return this.deleteEmploymentContract(id, user);
  }

  /**
   * A method that deletes a EmploymentContract from the database
   * @param id An id of a EmploymentContract. A EmploymentContract with this id should exist in the database
   */
  async deleteEmploymentContract(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(
      EmploymentContract,
      id,
    );
    if (!deleteResponse.affected) {
      throw new EmploymentContractNotFoundException(id);
    }
  }
}
