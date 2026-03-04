import { Injectable } from '@nestjs/common';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { GetExperienceDto } from './dto/get-experience.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Experiences from './experience.entity';
import ExperienceNotFoundException from './exceptions/experience-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/users/interface/user.interface';

@Injectable()
export class ExperienceService {
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
   * A method that fetches the Experience from the database
   * @returns A promise with the list of Experiences
   */
  async getAllExperiences(query: GetExperienceDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Experiences>['where'] = {};
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
    const [items, count] = await entityManager.findAndCount(Experiences, {
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
   * A method that fetches a Experience with a given id. Example:
   *
   * @example
   * const Experience = await ExperienceService.getExperienceById(1);
   */
  async getExperienceById(
    experienceId: number,
    user: IUser,
  ): Promise<Experiences> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const experience = await entityManager.findOne(Experiences, {
      where: { id: experienceId },
    });
    if (experience) {
      return experience;
    }
    throw new ExperienceNotFoundException(experienceId);
  }

  /**
   *
   * @param Experience createExperience
   *
   */
  async createExperience(experience: CreateExperienceDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    experience.authorId = user.id;
    const newExperience = entityManager.create(Experiences, experience);
    await entityManager.save(newExperience);
    return newExperience;
  }

  /**
   * See the [definition of the UpdateExperienceDto file]{@link UpdateExperienceDto} to see a list of required properties
   */
  async updateExperience(
    id: number,
    user: IUser,
    experience: UpdateExperienceDto,
  ): Promise<Experiences> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Experiences, id, experience);
    const updatedExperience = await entityManager.findOne(Experiences, {
      where: { id: id },
    });
    if (updatedExperience) {
      return updatedExperience;
    }
    throw new ExperienceNotFoundException(id);
  }

  /**
   * @deprecated Use deleteExperience instead
   */
  async deleteExperienceById(id: number, user: IUser): Promise<void> {
    return this.deleteExperience(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteExperience(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Experiences, id);
    if (!deleteResponse.affected) {
      throw new ExperienceNotFoundException(id);
    }
  }
}
