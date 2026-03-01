import { Injectable } from '@nestjs/common';
import { CreateDelegateOutDto } from './dto/create-delegate-out.dto';
import { EntityManager } from 'typeorm';
import ContractDelegateOut from './delegate-out.entity';
import DelegateOutNotFoundException from './exception/delegate-out-not-found.exception';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../cloud/user/dto/get-user.dto';

@Injectable()
export class DelegateOutService {
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
  async getDelegateOutByContractId(contractId: number, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const items = await entityManager.find(ContractDelegateOut, {
      where: { contractId },
    });
    if (items) {
      return items;
    }
    throw new DelegateOutNotFoundException();
  }

  /**
   * A method that fetches a Access with a given id. Example:
   *
   * @example
   * const Access = await AccessService.getAccessById(1);
   */
  async getVDelegateByUserId(delegateName: string, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const items = await entityManager.find(ContractDelegateOut, {
      where: { delegateName: delegateName },
    });
    if (items) {
      const contractIds = [];

      for await (const item of items) {
        contractIds.push(item.contractId);
      }
      return contractIds;
    }
    throw new DelegateOutNotFoundException();
  }

  /**
   *
   * @param Contract createContract
   *
   */
  async createViewUser(delegateOut: CreateDelegateOutDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newDelegateOut = entityManager.create(
      ContractDelegateOut,
      delegateOut,
    );
    await entityManager.save(newDelegateOut);
    return newDelegateOut;
  }
}
