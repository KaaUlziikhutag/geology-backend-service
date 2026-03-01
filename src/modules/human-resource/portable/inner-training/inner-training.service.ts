import { Injectable } from '@nestjs/common';
import { CreateInnerTrainingDto } from './dto/create-inner-training.dto';
import { UpdateInnerTrainingDto } from './dto/update-inner-training.dto';
import { GetInnerTrainingDto } from './dto/get-inner-training.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import InnerTrainings from './inner-training.entity';
import InnerTrainingNotFoundException from './exceptions/inner-training-not-found.exception';
import { PageDto } from '../../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../cloud/user/dto/get-user.dto';

@Injectable()
export class InnerTrainingService {
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
   * A method that fetches the InnerTraining from the database
   * @returns A promise with the list of InnerTrainings
   */
  async getAllInnerTrainings(query: GetInnerTrainingDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<InnerTrainings>['where'] = {};
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
    const [items, count] = await entityManager.findAndCount(InnerTrainings, {
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
   * A method that fetches a InnerTraining with a given id. Example:
   *
   * @example
   * const InnerTraining = await InnerTrainingService.getInnerTrainingById(1);
   */
  async getInnerTrainingById(
    innerTrainingId: number,
    user: GetUserDto,
  ): Promise<InnerTrainings> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const InnerTraining = await entityManager.findOne(InnerTrainings, {
      where: { id: innerTrainingId },
    });
    if (InnerTraining) {
      return InnerTraining;
    }
    throw new InnerTrainingNotFoundException(innerTrainingId);
  }

  /**
   *
   * @param InnerTraining createInnerTraining
   *
   */
  async createInnerTraining(
    innerTraining: CreateInnerTrainingDto,
    user: GetUserDto,
  ) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    innerTraining.authorId = user.workerId;
    const newInnerTraining = entityManager.create(
      InnerTrainings,
      innerTraining,
    );
    await entityManager.save(InnerTrainings, newInnerTraining);
    return newInnerTraining;
  }

  /*
   * See the [definition of the UpdateInnerTrainingDto file]{@link UpdateInnerTrainingDto} to see a list of required properties
   */
  async updateInnerTraining(
    id: number,
    user: GetUserDto,
    innerTraining: UpdateInnerTrainingDto,
  ): Promise<InnerTrainings> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(InnerTrainings, id, innerTraining);
    const updatedInnerTraining = await entityManager.findOne(InnerTrainings, {
      where: { id: id },
    });
    if (updatedInnerTraining) {
      return updatedInnerTraining;
    }
    throw new InnerTrainingNotFoundException(id);
  }

  /**
   * @deprecated Use deleteInnerTraining instead
   */
  async deleteInnerTrainingById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteInnerTraining(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteInnerTraining(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(InnerTrainings, id);
    if (!deleteResponse.affected) {
      throw new InnerTrainingNotFoundException(id);
    }
  }
}
