import { Injectable } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-languages.dto';
import { UpdateLanguageDto } from './dto/update-languages.dto';
import { GetLanguageDto } from './dto/get-languages.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Languages from './languages.entity';
import LanguageNotFoundException from './exceptions/languages-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class LanguageService {
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
   * A method that fetches the Language from the database
   * @returns A promise with the list of Languages
   */
  async getAllLanguages(query: GetLanguageDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Languages>['where'] = {};
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
    const [items, count] = await entityManager.findAndCount(Languages, {
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
   * A method that fetches a Language with a given id. Example:
   *
   * @example
   * const Language = await LanguageService.getLanguageById(1);
   */
  async getLanguageById(languageId: number, user: IUser): Promise<Languages> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const language = await entityManager.findOne(Languages, {
      where: { id: languageId },
    });
    if (language) {
      return language;
    }
    throw new LanguageNotFoundException(languageId);
  }

  /**
   *
   * @param Language createLanguage
   *
   */
  async createLanguage(language: CreateLanguageDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    language.authorId = user.id;
    const newLanguage = entityManager.create(Languages, language);
    await entityManager.save(newLanguage);
    return newLanguage;
  }

  /**
   * See the [definition of the UpdateLanguageDto file]{@link UpdateLanguageDto} to see a list of required properties
   */
  async updateLanguage(
    id: number,
    user: IUser,
    language: UpdateLanguageDto,
  ): Promise<Languages> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Languages, id, language);
    const updatedLanguage = await entityManager.findOne(Languages, {
      where: { id: id },
    });
    if (updatedLanguage) {
      return updatedLanguage;
    }
    throw new LanguageNotFoundException(id);
  }

  /**
   * @deprecated Use deleteLanguage instead
   */
  async deleteLanguageById(id: number, user: IUser): Promise<void> {
    return this.deleteLanguage(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteLanguage(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Languages, id);
    if (!deleteResponse.affected) {
      throw new LanguageNotFoundException(id);
    }
  }
}
