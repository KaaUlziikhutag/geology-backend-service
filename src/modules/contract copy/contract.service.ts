import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { GetContractDto } from './dto/get-contract.dto';
import {
  Between,
  EntityManager,
  Equal,
  FindManyOptions,
  In,
  Not,
} from 'typeorm';
import Contract from './contract.entity';
import ContractNotFoundException from './exceptions/contract-not-found.exception';
import { PageDto } from '../../utils/dto/page.dto';
import { PageMetaDto } from '../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../cloud/user/dto/get-user.dto';
import ContractViewUser from './view-users/view-users.entity';
import ContractDelegateOur from './delegate-our/delegate-our.entity';
import ContractDelegateOut from './delegate-out/delegate-out.entity';
import { AccessType, ContractState, DateType } from '../../utils/globalUtils';
import Trees from '../human-resource/tree/tree.entity';

@Injectable()
export class ContractService {
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
  async getAllContracts(query: GetContractDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Contract>['where'] = {};
    if (query.comId) {
      where.authorId = Equal(query.comId);
    }
    if (query.typeId) {
      where.typeId = Equal(query.typeId);
    }
    if (query.isDraft) {
      where.isDraft = Equal(query.isDraft);
    }
    if (query.parentId) {
      where.id = Not(query.parentId);
    }
    if (query.state) {
      const states = query.state.split(',').map((type) => type.trim());
      where.state = In(states);
    }
    if (query.startDate) {
      query.startDate.setHours(0, 0, 0, 0);
      query.endDate.setHours(23, 59, 59, 999);
    }
    if (query.accessType == AccessType.Simple) {
      where.viewUsers = [{ userId: Equal(user.workerId) }];
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
    const page =
      query.page && !isNaN(query.page) && query.page > 0
        ? Number(query.page)
        : 1;
    const limit =
      query.limit && !isNaN(query.limit) && query.limit > 0
        ? Number(query.limit)
        : undefined;
    const skip = limit ? (page - 1) * limit : undefined;
    const [items, count] = await entityManager.findAndCount(Contract, {
      where,
      order: {
        createdAt: 'DESC',
      },
      relations: ['categoryOrganization', 'type', 'children', 'parent'],
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
  async getContractById(
    contractId: number,
    user: GetUserDto,
  ): Promise<Contract> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const contract = await entityManager.findOne(Contract, {
      where: { id: contractId },
      relations: [
        'categoryOrganization',
        'type',
        'delegateOur',
        'delegateOur.worker',
        'delegateOur.worker.humans',
        'delegateOur.worker.appTree',
        'delegateOut',
        'trees',
        'parent',
        'children',
        'viewUsers',
        'viewUsers.worker',
        'viewUsers.worker.appTree',
        'viewUsers.worker.humans',
        'ourConfirmWorker.humans',
        'ourConfirmWorker.appTree',
        'ourConfirmWorker',
      ],
    });
    if (contract) {
      return contract;
    }
    throw new ContractNotFoundException(contractId);
  }

  /**
   *
   * @param Contract createContract
   *
   */

  async createContract(contract: CreateContractDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    contract.authorId = user.id;
    contract.comId = user.companyId;
    const existingContract = await entityManager.findOne(Contract, {
      where: { number: contract.number },
    });
    if (existingContract) {
      throw new BadRequestException(
        `"${contract.number}" тоот гэрээний дугаар өмнө бүртгэгдсэн байна.`,
      );
    }
    if (contract.voidContract) {
      await entityManager.update(Contract, contract.voidContract, {
        state: ContractState.Cancelled,
      });
    }
    if (contract.treeIds && contract.treeIds.length > 0) {
      const trees = await entityManager.find(Trees, {
        where: { id: In(contract.treeIds) },
      });
      if (!trees || trees.length !== contract.treeIds.length) {
        throw new Error('Some of the treeIds are invalid');
      }
      contract.trees = trees;
    }
    const newContract = entityManager.create(Contract, contract);
    await entityManager.save(newContract);
    if (contract.viewUserIds && contract.viewUserIds.length > 0) {
      const contractViewUsers = contract.viewUserIds.map((id) => {
        return entityManager.create(ContractViewUser, {
          contractId: newContract.id,
          userId: id,
        });
      });
      await entityManager.save(ContractViewUser, contractViewUsers);
    }
    if (contract.delegateOurIds && contract.delegateOurIds.length > 0) {
      const contractDelegateOurs = contract.delegateOurIds.map((id) => {
        return entityManager.create(ContractDelegateOur, {
          contractId: newContract.id,
          delegateId: id,
        });
      });
      await entityManager.save(ContractDelegateOur, contractDelegateOurs);
    }

    if (contract.delegateOuts && contract.delegateOuts.length > 0) {
      const contractDelegateOuts = contract.delegateOuts.map((name) => {
        return entityManager.create(ContractDelegateOut, {
          contractId: newContract.id,
          delegateName: name,
        });
      });
      await entityManager.save(ContractDelegateOut, contractDelegateOuts);
    }

    return newContract;
  }

  /**
   * See the [definition of the UpdateContractDto file]{@link UpdateContractDto} to see a list of required properties
   */
  async updateContract(
    id: number,
    user: GetUserDto,
    contract: UpdateContractDto,
  ): Promise<Contract> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    if (!contract.isNotVoid) {
      if (contract.voidContract) {
        await entityManager.update(Contract, contract.voidContract, {
          state: ContractState.Cancelled,
        });
      } else {
        const contractVoid = await entityManager.findOne(Contract, {
          where: { id: id },
        });
        if (contractVoid?.voidContract) {
          await entityManager.update(Contract, contractVoid.voidContract, {
            state: ContractState.Active,
          });
        }
      }
    }
    if (contract.number) {
      const existingContract = await entityManager.findOne(Contract, {
        where: { number: contract.number, id: Not(id) },
      });
      if (existingContract) {
        throw new BadRequestException(
          `"${contract.number}" тоот гэрээний дугаар өмнө бүртгэгдсэн байна.`,
        );
      }
    }
    const existingContract = await entityManager.findOne(Contract, {
      where: { id: id },
      relations: ['trees'],
    });
    if (!existingContract) {
      throw new ContractNotFoundException(id);
    }
    if (contract.treeIds && contract.treeIds.length > 0) {
      const trees = await entityManager.find(Trees, {
        where: { id: In(contract.treeIds) },
      });
      if (!trees || trees.length !== contract.treeIds.length) {
        throw new Error('Some of the treeIds are invalid');
      }
      contract.trees = trees;
    }
    const updatedContract = await entityManager.findOne(Contract, {
      where: { id: id },
    });

    if (!updatedContract) {
      throw new ContractNotFoundException(id);
    }

    if (contract.viewUserIds && contract.viewUserIds.length > 0) {
      await entityManager.delete(ContractViewUser, { contractId: id });
      const contractViewUsers = contract.viewUserIds.map((workerId) => {
        return entityManager.create(ContractViewUser, {
          contractId: id,
          userId: workerId,
        });
      });
      await entityManager.save(ContractViewUser, contractViewUsers);
    }
    if (contract.delegateOurIds && contract.delegateOurIds.length > 0) {
      await entityManager.delete(ContractDelegateOur, { contractId: id });
      const contractDelegateOurs = contract.delegateOurIds.map((delegateId) => {
        return entityManager.create(ContractDelegateOur, {
          contractId: id,
          delegateId: delegateId,
        });
      });
      await entityManager.save(ContractDelegateOur, contractDelegateOurs);
    }
    if (contract.delegateOuts && contract.delegateOuts.length > 0) {
      await entityManager.delete(ContractDelegateOut, { contractId: id });
      const contractDelegateOuts = contract.delegateOuts.map((name) => {
        return entityManager.create(ContractDelegateOut, {
          contractId: id,
          delegateName: name,
        });
      });
      await entityManager.save(ContractDelegateOut, contractDelegateOuts);
    }

    Object.assign(existingContract, contract);
    await entityManager.save(existingContract);
    return existingContract;
  }

  /**
   * @deprecated Use deleteContract instead
   */
  async deleteContractById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteContract(id, user);
  }

  /**
   * A method that deletes a contract from the database
   * @param id An id of a contract. A contract with this id should exist in the database
   */
  async deleteContract(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Contract, id);
    if (!deleteResponse.affected) {
      throw new ContractNotFoundException(id);
    }
  }
}
