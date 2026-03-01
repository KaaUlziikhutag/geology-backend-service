import { Injectable } from '@nestjs/common';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { UpdateApplicantDto } from './dto/update-applicant.dto';
import { GetApplicantDto } from './dto/get-applicant.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Applicant from './applicant.entity';
import ApplicantNotFoundException from './exceptions/applicant-not-found.exception';
import { PageDto } from '../../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../cloud/user/dto/get-user.dto';

@Injectable()
export class ApplicantService {
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
   * A method that fetches the Applicant from the database
   * @returns A promise with the list of Applicants
   */
  async getAllApplicants(query: GetApplicantDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Applicant>['where'] = {};
    if (query.appId) {
      where.appId = Equal(query.appId);
    }
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    const skip = (query.page - 1) * query.limit;

    const [items, count] = await entityManager.findAndCount(Applicant, {
      where,
      order: {
        createdAt: 'DESC',
      },
      skip: skip,
      take: query.limit,
    });

    const page = Number(query.page);
    const limit = Number(query.limit);
    const itemCount = count;

    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });

    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a Applicant with a given id. Example:
   *
   * @example
   * const Applicant = await ApplicantService.getApplicantById(1);
   */
  async getApplicantById(
    applicantId: number,
    user: GetUserDto,
  ): Promise<Applicant> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const applicant = await entityManager.findOne(Applicant, {
      where: { id: applicantId },
    });
    if (applicant) {
      return applicant;
    }
    throw new ApplicantNotFoundException(applicantId);
  }

  /**
   *
   * @param Applicant createApplicant
   *
   */
  async createApplicant(applicant: CreateApplicantDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newApplicant = entityManager.create(Applicant, applicant);
    await entityManager.save(newApplicant);
    return newApplicant;
  }

  /**
   * See the [definition of the UpdateApplicantDto file]{@link UpdateApplicantDto} to see a list of required properties
   */
  async updateApplicant(
    id: number,
    user: GetUserDto,
    applicant: UpdateApplicantDto,
  ): Promise<Applicant> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Applicant, id, applicant);
    const updatedApplicant = await entityManager.findOne(Applicant, {
      where: { id: id },
    });
    if (updatedApplicant) {
      return updatedApplicant;
    }
    throw new ApplicantNotFoundException(id);
  }

  /**
   * @deprecated Use deleteApplicant instead
   */
  async deleteApplicantById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteApplicant(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteApplicant(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(Applicant, id);
    if (!deleteResponse.affected) {
      throw new ApplicantNotFoundException(id);
    }
  }
}
