import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contacts.dto';
import { UpdateContactDto } from './dto/update-contacts.dto';
import { GetContactDto } from './dto/get-contacts.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Contacts from './contacts.entity';
import ContactNotFoundException from './exceptions/contacts-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/users/interface/user.interface';

@Injectable()
export class ContactService {
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
   * A method that fetches the Contact from the database
   * @returns A promise with the list of Contacts
   */
  async getAllContacts(query: GetContactDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Contacts>['where'] = {};
    if (query.userId) {
      where.userId = Equal(query.userId);
    }
    if (query.authorId) {
      where.authorId = Equal(query.authorId);
    }
    const page =
      query.page && !isNaN(query.page) && query.page > 0
        ? Number(query.page)
        : 1;
    const limit =
      query.limit && !isNaN(query.limit) && query.limit > 0
        ? Number(query.limit)
        : 10;
    const skip = (page - 1) * limit;
    const [items, count] = await entityManager.findAndCount(Contacts, {
      where,
      order: {
        createdAt: 'DESC',
      },
      skip: skip,
      take: limit,
    });
    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }
  /**
   * A method that fetches a Contact with a given id. Example:
   *
   * @example
   * const Contact = await ContactService.getContactById(1);
   */
  async getContactById(contactId: number, user: IUser): Promise<Contacts> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const contact = await entityManager.findOne(Contacts, {
      where: { id: contactId },
    });
    if (contact) {
      return contact;
    }
    throw new ContactNotFoundException(contactId);
  }

  /**
   *
   * @param Contact createContact
   *
   */
  async createContact(contact: CreateContactDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    contact.authorId = user.id;
    const newContact = entityManager.create(Contacts, contact);
    await entityManager.save(newContact);
    return newContact;
  }

  /**
   * See the [definition of the UpdateContactDto file]{@link UpdateContactDto} to see a list of required properties
   */
  async updateContact(
    id: number,
    user: IUser,
    contact: UpdateContactDto,
  ): Promise<Contacts> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Contacts, id, contact);
    const updatedContact = await entityManager.findOne(Contacts, {
      where: { id: id },
    });
    if (updatedContact) {
      return updatedContact;
    }
    throw new ContactNotFoundException(id);
  }

  /**
   * @deprecated Use deleteContact instead
   */
  async deleteContactById(id: number, user: IUser): Promise<void> {
    return this.deleteContact(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteContact(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(Contacts, id);
    if (!deleteResponse.affected) {
      throw new ContactNotFoundException(id);
    }
  }
}
