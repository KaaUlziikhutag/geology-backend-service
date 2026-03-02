import { Injectable } from '@nestjs/common';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { GetTrainingDto } from './dto/get-training.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Trainings from './training.entity';
import TrainingNotFoundException from './exceptions/training-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class TrainingService {
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
   * A method that fetches the Training from the database
   * @returns A promise with the list of Trainings
   */
  async getAllTrainings(query: GetTrainingDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Trainings>['where'] = {};
    if (query.userId) {
      where.userId = Equal(query.userId);
    }
    if (query.autorId) {
      where.autorId = Equal(query.autorId);
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
    const [items, count] = await entityManager.findAndCount(Trainings, {
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
   * A method that fetches a Training with a given id. Example:
   *
   * @example
   * const Training = await TrainingService.getTrainingById(1);
   */
  async getTrainingById(trainingId: number, user: IUser): Promise<Trainings> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const training = await entityManager.findOne(Trainings, {
      where: { id: trainingId },
    });
    if (training) {
      return training;
    }
    throw new TrainingNotFoundException(trainingId);
  }

  /**
   *
   * @param Training createTraining
   *
   */
  async createTraining(training: CreateTrainingDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    training.autorId = user.id;
    const newTraining = entityManager.create(Trainings, training);
    await entityManager.save(Trainings, newTraining);
    return newTraining;
  }

  /*
   * See the [definition of the UpdateTrainingDto file]{@link UpdateTrainingDto} to see a list of required properties
   */
  async updateTraining(
    id: number,
    user: IUser,
    training: UpdateTrainingDto,
  ): Promise<Trainings> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Trainings, id, training);
    const updatedTraining = await entityManager.findOne(Trainings, {
      where: { id: id },
    });
    if (updatedTraining) {
      return updatedTraining;
    }
    throw new TrainingNotFoundException(id);
  }

  /**
   * @deprecated Use deleteTraining instead
   */
  async deleteTrainingById(id: number, user: IUser): Promise<void> {
    return this.deleteTraining(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteTraining(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Trainings, id);
    if (!deleteResponse.affected) {
      throw new TrainingNotFoundException(id);
    }
  }
}
