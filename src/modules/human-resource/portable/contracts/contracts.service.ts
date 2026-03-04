import { Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contracts.dto';
import { UpdateContractDto } from './dto/update-contracts.dto';
import { GetContractDto } from './dto/get-contracts.dto';
import { EntityManager, Equal, FindManyOptions, ILike } from 'typeorm';
import Contracts from './contracts.entity';
import ContractNotFoundException from './exceptions/contracts-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/users/interface/user.interface';

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
   * @returns A promise with the list of Contracts
   */
  async getAllContracts(query: GetContractDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Contracts>['where'] = {};
    if (query.userId) {
      where.userId = Equal(query.userId);
    }
    if (query.number) {
      where.number = ILike('%' + query.number + '%');
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

    const [items, count] = await entityManager.findAndCount(Contracts, {
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
   * A method that fetches a Contract with a given id. Example:
   *
   * @example
   * const Contract = await ContractService.getContractById(1);
   */
  async getContractById(contractId: number, user: IUser): Promise<Contracts> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const contract = await entityManager.findOne(Contracts, {
      where: { id: contractId },
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
  async createContract(contract: CreateContractDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newContract = entityManager.create(Contracts, contract);
    await entityManager.save(newContract);
    return newContract;
  }

  /**
   * See the [definition of the UpdateContractDto file]{@link UpdateContractDto} to see a list of required properties
   */
  async updateContract(
    id: number,
    user: IUser,
    contract: UpdateContractDto,
  ): Promise<Contracts> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Contracts, id, contract);
    const updatedContract = await entityManager.findOne(Contracts, {
      where: { id: id },
    });
    if (updatedContract) {
      return updatedContract;
    }
    throw new ContractNotFoundException(id);
  }

  /**
   * @deprecated Use deleteContract instead
   */
  async deleteContractById(id: number, user: IUser): Promise<void> {
    return this.deleteContract(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteContract(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(Contracts, id);
    if (!deleteResponse.affected) {
      throw new ContractNotFoundException(id);
    }
  }
}
