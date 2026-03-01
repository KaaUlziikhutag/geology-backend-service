import { Injectable } from '@nestjs/common';
import { CreateDelegateOurDto } from './dto/create-delegate-our.dto';
import { EntityManager } from 'typeorm';
import ContractDelegateOur from './delegate-our.entity';
import ViewUserNotFoundException from './exception/delegate-our-not-found.exception';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../cloud/user/dto/get-user.dto';

@Injectable()
export class DelegateOurService {
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
   * A method that fetches a Access with a given id. Example:
   *
   * @example
   * const Access = await AccessService.getAccessById(1);
   */
  async getDelegateOurByContractId(contractId: number, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const items = await entityManager.find(ContractDelegateOur, {
      where: { contractId },
    });
    if (items) {
      return items;
    }
    throw new ViewUserNotFoundException();
  }

  /**
   * A method that fetches a Access with a given id. Example:
   *
   * @example
   * const Access = await AccessService.getAccessById(1);
   */
  async getViewUsersByDelegateId(delegateId: number, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const items = await entityManager.find(ContractDelegateOur, {
      where: { delegateId },
    });
    if (items) {
      const contractIds = [];

      for await (const item of items) {
        contractIds.push(item.contractId);
      }
      return contractIds;
    }
    throw new ViewUserNotFoundException();
  }

  /**
   *
   * @param Contract createDelegateOur
   *
   */
  async createDelegateOur(viewUser: CreateDelegateOurDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newDelegateOur = entityManager.create(ContractDelegateOur, viewUser);
    await entityManager.save(newDelegateOur);
    return newDelegateOur;
  }
}
