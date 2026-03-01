import { Injectable } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { GetWorkerDto } from './dto/get-worker.dto';
import { EntityManager, Equal, FindManyOptions, ILike } from 'typeorm';
import Worker from './worker.entity';
import WorkerNotFoundException from './exceptions/worker-not-found.exception';
import { PageDto } from '../../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../cloud/user/dto/get-user.dto';
import { UpdateWorkerAuthorDto } from './dto/update-author.dto';

@Injectable()
export class WorkerService {
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
   * A method that fetches the Worker from the database
   * @returns A promise with the list of Workers
   */
  async getAllWorkers(query: GetWorkerDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Worker>['where'] = {};
    if (query.isActive) {
      where.isActive = Equal(query.isActive);
    }
    if (query.filter) {
      where.humans = [
        { regNumber: ILike(`%${query.filter}%`) },
        { lastName: ILike(`%${query.filter}%`) },
        { firstName: ILike(`%${query.filter}%`) },
      ];
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
    const [items, count] = await entityManager.findAndCount(Worker, {
      where,
      order: {
        createdAt: 'DESC',
      },
      skip: skip,
      take: limit,
      relations: ['humans', 'children', 'occupations'],
    });
    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a Worker with a given id. Example:
   *
   * @example
   * const Worker = await WorkerService.getWorkerById(1);
   */
  async getWorkerById(workerId: number, user: GetUserDto): Promise<Worker> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const worker = await entityManager.findOne(Worker, {
      where: { id: workerId },
      relations: ['humans', 'children', 'occupations'],
    });
    if (worker) {
      return worker;
    }
    throw new WorkerNotFoundException(workerId);
  }
  /**
   *
   * @param Worker createWorker
   *
   */
  async createWorker(user: GetUserDto, worker: CreateWorkerDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newWorker = entityManager.create(Worker, worker);
    await entityManager.save(newWorker);
    return newWorker;
  }

  /**
   * See the [definition of the UpdateWorkerDto file]{@link UpdateWorkerDto} to see a list of required properties
   */
  async updateWorker(
    id: number,
    user: GetUserDto,
    worker: UpdateWorkerDto,
  ): Promise<Worker> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Worker, id, worker);
    const updatedWorker = await entityManager.findOne(Worker, {
      where: { id: id },
    });
    if (updatedWorker) {
      return updatedWorker;
    }
    throw new WorkerNotFoundException(id);
  }

  async updateWorkerType(
    ids: number[],
    user: GetUserDto,
    worker: UpdateWorkerAuthorDto,
  ): Promise<Worker[]> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const updatedWorkers: Worker[] = [];
    for (const id of ids) {
      await entityManager.update(Worker, id, worker);
      const updatedWorker = await entityManager.findOne(Worker, {
        where: { id: id },
      });
      if (!updatedWorker) {
        throw new WorkerNotFoundException(id);
      }
      updatedWorkers.push(updatedWorker);
    }
    return updatedWorkers;
  }

  /**
   * @deprecated Use deleteWorker instead
   */
  async deleteWorkerById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteWorker(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteWorker(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(Worker, id);
    if (!deleteResponse.affected) {
      throw new WorkerNotFoundException(id);
    }
  }
}
