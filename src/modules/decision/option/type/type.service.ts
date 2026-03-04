import { Injectable } from '@nestjs/common';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { GetTypeDto } from './dto/get-type.dto';
import { EntityManager, Equal, FindManyOptions, ILike } from 'typeorm';
import Type from './type.entity';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/users/interface/user.interface';
import TypeNotFoundException from './exceptions/type-not-found.exception';

@Injectable()
export class DecisionTypeService {
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
   * A method that fetches the Type from the database
   * @returns A promise with the list of Type
   */
  async getAllTypes(query: GetTypeDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Type>['where'] = {};
    if (query.name) {
      where.name = ILike('%' + query.name + '%');
    }
    if (query.note) {
      where.note = ILike('%' + query.note + '%');
    }
    if (query.decisionType) {
      where.decisionType = Equal(query.decisionType);
    }
    if (query.writingCategory) {
      where.writingCategory = Equal(query.writingCategory);
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
    const [items, count] = await entityManager.findAndCount(Type, {
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
   * A method that fetches a Type with a given id. Example:
   *
   * @example
   * const Type = await typeService.getCategoryById(1);
   */
  async getTypeById(typeId: number, user: IUser): Promise<Type> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const type = await entityManager.findOne(Type, {
      where: { id: typeId },
    });
    if (type) {
      return type;
    }
    throw new TypeNotFoundException(typeId);
  }

  /**
   *
   * @param Type createType
   *
   */
  async createType(type: CreateTypeDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    type.comId = null;
    const newType = entityManager.create(Type, type);
    await entityManager.save(newType);
    return newType;
  }

  /**
   * See the [definition of the UpdateTypeDto file]{@link UpdateTypeDto} to see a list of required properties
   */
  async updateType(
    id: number,
    user: IUser,
    type: UpdateTypeDto,
  ): Promise<Type> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Type, id, type);
    const updatedType = await entityManager.findOne(Type, {
      where: { id: id },
    });
    if (updatedType) {
      return updatedType;
    }
    throw new TypeNotFoundException(id);
  }

  /**
   * @deprecated Use deleteType instead
   */
  async deleteTypeById(id: number, user: IUser): Promise<void> {
    return this.deleteType(id, user);
  }

  /**
   * A method that deletes a type from the database
   * @param id An id of a type. A type with this id should exist in the database
   */
  async deleteType(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Type, id);
    if (!deleteResponse.affected) {
      throw new TypeNotFoundException(id);
    }
  }
}
