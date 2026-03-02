import { Injectable } from '@nestjs/common';
import { CreateConnectionUserDto } from './dto/create-connection-user.dto';
import { EntityManager } from 'typeorm';
import ServerConnectionUser from './connection-users.entity';
import ConnectionUserNotFoundException from './exception/connection-user-not-found.exception';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class ConnectionUserService {
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
  async getConnectionUsersByServerId(serverId: number, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const items = await entityManager.find(ServerConnectionUser, {
      where: { serverId },
    });
    if (items) {
      return items;
    }
    throw new ConnectionUserNotFoundException();
  }

  /**
   * A method that fetches a Access with a given id. Example:
   *
   * @example
   * const Access = await AccessService.getAccessById(1);
   */
  async getConnectionUsersByUserId(userId: number, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const items = await entityManager.find(ServerConnectionUser, {
      where: { userId },
    });
    if (items) {
      const serverIds = [];

      for await (const item of items) {
        serverIds.push(item.serverId);
      }
      return serverIds;
    }
    throw new ConnectionUserNotFoundException();
  }

  /**
   *
   * @param Contract createContract
   *
   */
  async createConnectionUser(viewUser: CreateConnectionUserDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newConnUser = entityManager.create(ServerConnectionUser, viewUser);
    await entityManager.save(newConnUser);
    return newConnUser;
  }
}
