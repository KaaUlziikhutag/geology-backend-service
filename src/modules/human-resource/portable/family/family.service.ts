import { Injectable } from '@nestjs/common';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family-human.dto';
import { GetFamilyDto } from './dto/get-family.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Families from './family.entity';
import FamilyNotFoundException from './exceptions/family-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class FamilyService {
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
   * A method that fetches the Family from the database
   * @returns A promise with the list of Familys
   */
  async getAllFamilys(query: GetFamilyDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Families>['where'] = {};
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
    const [items, count] = await entityManager.findAndCount(Families, {
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
   * A method that fetches a Family with a given id. Example:
   *
   * @example
   * const Family = await FamilyService.getFamilyById(1);
   */
  async getFamilyById(familyId: number, user: IUser): Promise<Families> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const family = await entityManager.findOne(Families, {
      where: { id: familyId },
    });
    if (family) {
      return family;
    }
    throw new FamilyNotFoundException(familyId);
  }

  /**
   *
   * @param Family createFamily
   *
   */
  async createFamily(family: CreateFamilyDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    family.authorId = user.id;
    const newFamilies = entityManager.create(Families, family);
    await entityManager.save(newFamilies);
    return newFamilies;
  }

  /**
   * See the [definition of the UpdateFamilyDto file]{@link UpdateFamilyDto} to see a list of required properties
   */
  async updateFamily(
    id: number,
    user: IUser,
    family: UpdateFamilyDto,
  ): Promise<Families> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Families, id, family);
    const updatedFamily = await entityManager.findOne(Families, {
      where: { id: id },
    });
    if (updatedFamily) {
      return updatedFamily;
    }
    throw new FamilyNotFoundException(id);
  }

  /**
   * @deprecated Use deleteFamily instead
   */
  async deleteFamilyById(id: number, user: IUser): Promise<void> {
    return this.deleteFamily(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteFamily(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Families, id);
    if (!deleteResponse.affected) {
      throw new FamilyNotFoundException(id);
    }
  }
}
