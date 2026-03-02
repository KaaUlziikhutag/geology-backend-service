import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { EntityManager } from 'typeorm';
import MailUser from './users.entity';
import UserNotFoundException from './exception/user-not-found.exception';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { UpdateUserMailDto } from './dto/update-mail.dto';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class MailUserService {
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
  async getUsersByMailId(mailId: number, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const items = await entityManager.find(MailUser, {
      where: { mailId },
    });
    if (items) {
      return items;
    }
    throw new UserNotFoundException();
  }

  /**
   * A method that fetches a Access with a given id. Example:
   *
   * @example
   * const Access = await AccessService.getAccessById(1);
   */
  async getUsersByUserId(userId: number, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const items = await entityManager.find(MailUser, {
      where: { userId },
    });
    if (items) {
      const mailIds = [];

      for await (const item of items) {
        mailIds.push(item.mailId);
      }
      return mailIds;
    }
    throw new UserNotFoundException();
  }

  /**
   *
   * @param Contract createContract
   *
   */
  async createMailUser(mailUser: CreateUserDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newMailUser = entityManager.create(MailUser, mailUser);
    await entityManager.save(newMailUser);
    return newMailUser;
  }

  async updateMailUser(
    id: number,
    user: IUser,
    mail: UpdateUserMailDto,
  ): Promise<MailUser> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(MailUser, id, mail);
    const updatedMail = await entityManager.findOne(MailUser, {
      where: { id: id },
    });
    if (updatedMail) {
      return updatedMail;
    }
    throw new HttpException('${id} not found', HttpStatus.BAD_REQUEST);
  }
}
