import { Injectable } from '@nestjs/common';
import { CreateQualificationDto } from './dto/create-qualification.dto';
import { UpdateQualificationDto } from './dto/update-qualification.dto';
import { GetQualificationDto } from './dto/get-qualification.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Qualifications from './qualification.entity';
import QualificationNotFoundException from './exceptions/qualification-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/users/interface/user.interface';

@Injectable()
export class QualificationService {
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
   * A method that fetches the Qualification from the database
   * @returns A promise with the list of Qualifications
   */
  async getAllQualifications(query: GetQualificationDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Qualifications>['where'] = {};
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
    const [items, count] = await entityManager.findAndCount(Qualifications, {
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
   * A method that fetches a Qualification with a given id. Example:
   *
   * @example
   * const Qualification = await QualificationService.getQualificationById(1);
   */
  async getQualificationById(
    qualificationId: number,
    user: IUser,
  ): Promise<Qualifications> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const qualification = await entityManager.findOne(Qualifications, {
      where: { id: qualificationId },
    });
    if (qualification) {
      return qualification;
    }
    throw new QualificationNotFoundException(qualificationId);
  }

  /**
   *
   * @param Qualification createQualification
   *
   *
   */
  async createQualification(
    qualification: CreateQualificationDto,
    user: IUser,
  ) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    qualification.authorId = user.id;
    const newQualification = entityManager.create(
      Qualifications,
      qualification,
    );
    await entityManager.save(newQualification);
    return newQualification;
  }

  /**
   * See the [definition of the UpdateQualificationDto file]{@link UpdateQualificationDto} to see a list of required properties
   */
  async updateQualification(
    id: number,
    user: IUser,
    qualification: UpdateQualificationDto,
  ): Promise<Qualifications> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Qualifications, id, qualification);
    const updatedQualification = await entityManager.findOne(Qualifications, {
      where: { userId: id },
    });
    if (updatedQualification) {
      return updatedQualification;
    }
    throw new QualificationNotFoundException(id);
  }

  /**
   * @deprecated Use deleteQualification instead
   */
  async deleteQualificationById(id: number, user: IUser): Promise<void> {
    return this.deleteQualification(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteQualification(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Qualifications, id);
    if (!deleteResponse.affected) {
      throw new QualificationNotFoundException(id);
    }
  }
}
