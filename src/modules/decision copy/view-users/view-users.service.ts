import { Injectable } from '@nestjs/common';
import { CreateViewUserDto } from './dto/create-view-user.dto';
import { EntityManager } from 'typeorm';
import ContractViewUser from './view-users.entity';
import ViewUserNotFoundException from './exception/view-user-not-found.exception';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../cloud/user/dto/get-user.dto';

@Injectable()
export class DecisionViewUserService {
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
  async getViewUsersByContractId(innerId: number, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const items = await entityManager.find(ContractViewUser, {
      where: { innerId },
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
  async getViewUsersByUserId(userId: number, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const items = await entityManager.find(ContractViewUser, {
      where: { userId },
    });
    if (items) {
      const decisionIds = [];

      for await (const item of items) {
        decisionIds.push(item.innerId);
      }
      return decisionIds;
    }
    throw new ViewUserNotFoundException();
  }

  /**
   *
   * @param Contract createContract
   *
   */
  async createViewUser(viewUser: CreateViewUserDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newViewUser = entityManager.create(ContractViewUser, viewUser);
    await entityManager.save(newViewUser);
    return newViewUser;
  }
}
