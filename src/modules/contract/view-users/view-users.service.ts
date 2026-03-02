import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import ContractViewUser from './view-users.entity';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import CreateViewUserDto from '@modules/decision/view-users/dto/create-view-user.dto';
import ViewUserNotFoundException from '@modules/decision/view-users/exception/view-user-not-found.exception';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class ViewUserService {
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
  async getViewUsersByContractId(contractId: number, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const items = await entityManager.find(ContractViewUser, {
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
  async getViewUsersByUserId(userId: number, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const items = await entityManager.find(ContractViewUser, {
      where: { userId },
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
   * @param Contract createContract
   *
   */
  async createViewUser(viewUser: CreateViewUserDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newViewUser = entityManager.create(ContractViewUser, viewUser);
    await entityManager.save(newViewUser);
    return newViewUser;
  }
}
