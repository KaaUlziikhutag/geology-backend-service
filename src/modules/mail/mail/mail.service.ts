import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import { GetMailDto } from './dto/get-mail.dto';
import {
  EntityManager,
  FindManyOptions,
  FindOptionsWhere,
  ILike,
} from 'typeorm';
import Mail from './mail.entity';
import MailNotFoundException from './exceptions/mail-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import MailUser from './users/users.entity';
import CreateUserDto from './users/dto/create-user.dto';
import { MailType } from '@utils/enum-utils';
import SignatureViewUser from '../signature/view-users/view-users.entity';
import IUser from '@modules/users/interface/user.interface';

@Injectable()
export class MailService {
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
  async getAllMails(query: GetMailDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Mail>['where'] = {};
    const userFilter: FindOptionsWhere<MailUser> = { userId: user.id };
    if (query.isRead !== undefined) {
      userFilter.isRead = query.isRead;
    }

    if (query.isTrash !== undefined) {
      userFilter.isTrash = query.isTrash;
    }

    if (query.isFavourite !== undefined) {
      userFilter.isFavourite = query.isFavourite;
    }

    if (query.mailType) {
      userFilter.state = query.mailType;
    }

    where.users = userFilter;

    if (query.subject) {
      where.subject = ILike(`%${query.subject}%`);
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

    const [items, count] = await entityManager.findAndCount(Mail, {
      where,
      order: { createdAt: 'DESC' },
      relations: ['users', 'users.worker', 'users.signature'],
      skip,
      take: limit,
    });

    const pageMetaDto = new PageMetaDto({ page, limit, itemCount: count });
    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a Access with a given id. Example:
   *
   * @example
   * const Access = await AccessService.getAccessById(1);
   */
  async getMailById(mailId: number, user: IUser): Promise<Mail> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const mail = await entityManager.findOne(Mail, {
      where: { id: mailId },
    });
    if (mail) {
      return mail;
    }
    throw new MailNotFoundException(mailId);
  }

  /**
   *
   * @param Mail createMail
   *
   */
  async createMail(mail: CreateMailDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    mail.authorId = user.id;
    const newMail = entityManager.create(Mail, mail);
    await entityManager.save(newMail);
    const sign = await entityManager.findOne(SignatureViewUser, {
      where: { userId: user.id, isActive: true },
    });
    if (mail.authorId) {
      const mailUser = entityManager.create(MailUser, {
        mailId: newMail.id,
        userId: mail.authorId,
        state: MailType.Sent,
        signatureId: sign.signatureId,
      });
      await entityManager.save(mailUser);
    }
    if (mail.viewUserIds && mail.viewUserIds.length > 0) {
      const mailViewUsers = mail.viewUserIds.map((id) => {
        return entityManager.create(MailUser, {
          mailId: newMail.id,
          userId: id,
          state: MailType.Inbox,
          signatureId: sign.signatureId,
        });
      });
      await entityManager.save(MailUser, mailViewUsers);
    }
    return newMail;
  }

  /**
   * See the [definition of the UpdateContractDto file]{@link UpdateSystemMailDto} to see a list of required properties
   */
  async updateMail(
    id: number,
    user: IUser,
    mail: UpdateMailDto,
  ): Promise<Mail> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Mail, id, mail);
    const updatedMail = await entityManager.findOne(Mail, {
      where: { id: id },
    });
    if (updatedMail) {
      return updatedMail;
    }
    throw new MailNotFoundException(id);
  }

  async updateIsReadMail(
    id: number,
    user: IUser,
    mail: CreateUserDto,
  ): Promise<Mail> {
    const entityManager = await this.loadEntityManager(user.dataBase);

    const mailUser = await entityManager.findOne(MailUser, {
      where: { mailId: id, id: mail.userId },
    });

    console.log('mailUser', mailUser);

    if (!mailUser) {
      throw new MailNotFoundException(id);
    }

    await entityManager.update(MailUser, id, mail);

    if (mailUser) {
      await entityManager.update(MailUser, mailUser.id, {
        isRead: mail.isRead,
        isFavourite: mail.isFavourite,
        isTrash: mail.isTrash,
      });
    }

    // Retrieve and return the updated mail entity
    return await entityManager.findOne(Mail, {
      where: { id: id },
    });
  }

  /**
   * @deprecated Use deleteContract instead
   */
  async deleteMailById(id: number, user: IUser): Promise<void> {
    return this.deleteMail(id, user);
  }

  /**
   * A method that deletes a contract from the database
   * @param id An id of a contract. A contract with this id should exist in the database
   */
  async deleteMail(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(Mail, id);
    if (!deleteResponse.affected) {
      throw new MailNotFoundException(id);
    }
  }
}
