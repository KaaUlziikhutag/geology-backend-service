import { Injectable } from '@nestjs/common';
import { CreateApplicantGroupDto } from './dto/create-applicant-group.dto';
import { UpdateApplicantGroupDto } from './dto/update-applicant-group.dto';
import { GetApplicantGroupDto } from './dto/get-applicant-group.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import ApplicantGroups from './applicant-group.entity';
import ApplicantGroupNotFoundException from './exceptions/applicant-group-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class ApplicantGroupService {
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
   * A method that fetches the ApplicantGroup from the database
   * @returns A promise with the list of ApplicantGroups
   */
  async getAllApplicantGroups(query: GetApplicantGroupDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<ApplicantGroups>['where'] = {};
    if (query.userId) {
      where.userId = Equal(query.userId);
    }
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    const skip = (query.page - 1) * query.limit;

    const [items, count] = await entityManager.findAndCount(ApplicantGroups, {
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
   * A method that fetches a ApplicantGroup with a given id. Example:
   *
   * @example
   * const ApplicantGroup = await ApplicantGroupService.getApplicantGroupById(1);
   */
  async getApplicantGroupById(
    applicantGroupId: number,
    user: IUser,
  ): Promise<ApplicantGroups> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const applicantGroup = await entityManager.findOne(ApplicantGroups, {
      where: { id: applicantGroupId },
    });
    if (applicantGroup) {
      return applicantGroup;
    }
    throw new ApplicantGroupNotFoundException(applicantGroupId);
  }

  /**
   *
   * @param ApplicantGroup createApplicantGroup
   *
   */
  async createApplicantGroup(
    applicantGroup: CreateApplicantGroupDto,
    user: IUser,
  ) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newApplicantGroup = entityManager.create(
      ApplicantGroups,
      applicantGroup,
    );
    await entityManager.save(newApplicantGroup);
    return newApplicantGroup;
  }

  /**
   * See the [definition of the UpdateApplicantGroupDto file]{@link UpdateApplicantGroupDto} to see a list of required properties
   */
  async updateApplicantGroup(
    id: number,
    user: IUser,
    applicantGroup: UpdateApplicantGroupDto,
  ): Promise<ApplicantGroups> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(ApplicantGroups, id, applicantGroup);
    const updatedApplicantGroup = await entityManager.findOne(ApplicantGroups, {
      where: { id: id },
    });
    if (updatedApplicantGroup) {
      return updatedApplicantGroup;
    }
    throw new ApplicantGroupNotFoundException(id);
  }

  /**
   * @deprecated Use deleteApplicantGroup instead
   */
  async deleteApplicantGroupById(id: number, user: IUser): Promise<void> {
    return this.deleteApplicantGroup(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteApplicantGroup(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(ApplicantGroups, id);
    if (!deleteResponse.affected) {
      throw new ApplicantGroupNotFoundException(id);
    }
  }
}
