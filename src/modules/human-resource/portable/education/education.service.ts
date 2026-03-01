import { Injectable } from '@nestjs/common';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { GetEducationDto } from './dto/get-education.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Educations from './education.entity';
import EducationNotFoundException from './exceptions/education-not-found.exception';
import { PageDto } from '../../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../cloud/user/dto/get-user.dto';

@Injectable()
export class EducationService {
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
   * A method that fetches the Education from the database
   * @returns A promise with the list of Educations
   */
  async getAllEducations(query: GetEducationDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Educations>['where'] = {};
    if (query.authorId) {
      where.authorId = Equal(query.authorId);
    }
    if (query.userId) {
      where.userId = Equal(query.userId);
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
    const [items, count] = await entityManager.findAndCount(Educations, {
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
   * A method that fetches a Education with a given id. Example:
   *
   * @example
   * const Education = await EducationService.getEducationById(1);
   */
  async getEducationById(
    educationId: number,
    user: GetUserDto,
  ): Promise<Educations> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const education = await entityManager.findOne(Educations, {
      where: { id: educationId },
    });
    if (education) {
      return education;
    }
    throw new EducationNotFoundException(educationId);
  }

  /**
   *
   * @param Education createEducation
   *
   *
   */
  async createEducation(education: CreateEducationDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    education.authorId = user.workerId;
    const newEducation = entityManager.create(Educations, education);
    await entityManager.save(newEducation);
    return newEducation;
  }

  /**
   * See the [definition of the UpdateEducationDto file]{@link UpdateEducationDto} to see a list of required properties
   */
  async updateEducation(
    id: number,
    user: GetUserDto,
    education: UpdateEducationDto,
  ): Promise<Educations> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Educations, id, education);
    const updatedEducation = await entityManager.findOne(Educations, {
      where: { userId: id },
    });
    if (updatedEducation) {
      return updatedEducation;
    }
    throw new EducationNotFoundException(id);
  }

  /**
   * @deprecated Use deleteEducation instead
   */
  async deleteEducationById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteEducation(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteEducation(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Educations, id);
    if (!deleteResponse.affected) {
      throw new EducationNotFoundException(id);
    }
  }
}
