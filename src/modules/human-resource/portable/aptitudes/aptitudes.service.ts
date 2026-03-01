import { Injectable } from '@nestjs/common';
import { CreateAptitudeDto } from './dto/create-aptitudes.dto';
import { UpdateAptitudeDto } from './dto/update-aptitudes.dto';
import { GetAptitudeDto } from './dto/get-aptitudess.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Aptitudes from './aptitudes.entity';
import AptitudeNotFoundException from './exceptions/aptitudes-not-found.exception';
import { PageDto } from '../../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../cloud/user/dto/get-user.dto';

@Injectable()
export class AptitudeService {
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
   * A method that fetches the Aptitude from the database
   * @returns A promise with the list of Aptitudes
   */
  async getAllAptitudes(query: GetAptitudeDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Aptitudes>['where'] = {};
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
    const [items, count] = await entityManager.findAndCount(Aptitudes, {
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
   * A method that fetches a Aptitude with a given id. Example:
   *
   * @example
   * const Aptitude = await AptitudeService.getAptitudeById(1);
   */
  async getAptitudeById(
    aptitudeId: number,
    user: GetUserDto,
  ): Promise<Aptitudes> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const aptitude = await entityManager.findOne(Aptitudes, {
      where: { id: aptitudeId },
    });
    if (aptitude) {
      return aptitude;
    }
    throw new AptitudeNotFoundException(aptitudeId);
  }

  /**
   *
   * @param Aptitude createAptitude
   *
   */
  async createAptitude(aptitude: CreateAptitudeDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    aptitude.authorId = user.workerId;
    const newAptitudes = entityManager.create(Aptitudes, aptitude);
    await entityManager.save(newAptitudes);
    return newAptitudes;
  }

  /**
   * See the [definition of the UpdateAptitudeDto file]{@link UpdateAptitudeDto} to see a list of required properties
   */
  async updateAptitude(
    id: number,
    user: GetUserDto,
    aptitude: UpdateAptitudeDto,
  ): Promise<Aptitudes> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Aptitudes, id, aptitude);
    const updatedAptitude = await entityManager.findOne(Aptitudes, {
      where: { id: id },
    });
    if (updatedAptitude) {
      return updatedAptitude;
    }
    throw new AptitudeNotFoundException(id);
  }

  /**
   * @deprecated Use deleteAptitude instead
   */
  async deleteAptitudeById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteAptitude(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteAptitude(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Aptitudes, id);
    if (!deleteResponse.affected) {
      throw new AptitudeNotFoundException(id);
    }
  }
}
