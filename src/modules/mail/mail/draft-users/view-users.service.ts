import { Injectable } from '@nestjs/common';
import { CreateViewUserDto } from './dto/create-view-user.dto';
import { EntityManager } from 'typeorm';
import SignatureViewUser from './view-users.entity';
import ViewUserNotFoundException from './exception/view-user-not-found.exception';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../cloud/user/dto/get-user.dto';

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
  async getViewUsersBySignatureId(signatureId: number, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const items = await entityManager.find(SignatureViewUser, {
      where: { signatureId },
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
    const items = await entityManager.find(SignatureViewUser, {
      where: { userId },
    });
    if (items) {
      const signatureIds = [];

      for await (const item of items) {
        signatureIds.push(item.signatureId);
      }
      return signatureIds;
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
    const newViewUser = entityManager.create(SignatureViewUser, viewUser);
    await entityManager.save(newViewUser);
    return newViewUser;
  }
}
