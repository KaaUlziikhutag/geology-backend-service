import { Injectable } from '@nestjs/common';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { UpdateVacationDto } from './dto/update-vacation.dto';
import { GetVacationDto } from './dto/get-vacation.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Vacation from './vacation.entity';
import VacationNotFoundException from './exceptions/vacation-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/cloud/user/interface/user.interface';
@Injectable()
export class VacationService {
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
   * A method that fetches the Vacation from the database
   * @returns A promise with the list of Vacations
   */
  async getAllVacations(query: GetVacationDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Vacation>['where'] = {};
    if (query.autorId) {
      where.autorId = Equal(query.autorId);
    }
    if (query.userId) {
      where.userId = Equal(query.userId);
    }
    const page =
      query.page && !isNaN(query.page) && query.page > 0
        ? Number(query.page)
        : 1;

    let limit: number | undefined;

    if (query.limit && !isNaN(query.limit) && query.limit > 0) {
      limit = Number(query.limit);
    }

    const skip = (page - 1) * (limit || 0);

    const [items, count] = await entityManager.findAndCount(Vacation, {
      where,
      order: {
        createdAt: 'DESC',
      },
      skip,
      take: limit,
    });

    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a Vacation with a given id. Example:
   *
   * @example
   * const Vacation = await VacationService.getVacationById(1);
   */
  async getVacationById(vacationId: number, user: IUser): Promise<Vacation> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const vacation = await entityManager.findOne(Vacation, {
      where: { id: vacationId },
    });
    if (vacation) {
      return vacation;
    }
    throw new VacationNotFoundException(vacationId);
  }

  /**
   *
   * @param socials createVacation
   *
   */
  async createVacation(vacation: CreateVacationDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const startDate = new Date(vacation.startDate);
    const endDate = new Date(vacation.endDate);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Invalid date format for startDate or endDate');
    }
    const durationInMilliseconds = endDate.getTime() - startDate.getTime();
    const decimalNumber = durationInMilliseconds / (24 * 60 * 60 * 1000);
    vacation.duration = Math.floor(decimalNumber);
    vacation.autorId = user.id;
    const newVacation = entityManager.create(Vacation, vacation);
    await entityManager.save(newVacation);
    return newVacation;
  }

  /**
   * See the [definition of the UpdateVacationDto file]{@link UpdateVacationDto} to see a list of required properties
   */
  async updateVacation(
    id: number,
    user: IUser,
    vacation: UpdateVacationDto,
  ): Promise<Vacation> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Vacation, id, vacation);
    const updatedVacation = await entityManager.findOne(Vacation, {
      where: { id: id },
    });
    if (updatedVacation) {
      return updatedVacation;
    }
    throw new VacationNotFoundException(id);
  }

  /**
   * @deprecated Use deleteVacation instead
   */
  async deleteVacationById(id: number, user: IUser): Promise<void> {
    return this.deleteVacation(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteVacation(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Vacation, id);
    if (!deleteResponse.affected) {
      throw new VacationNotFoundException(id);
    }
  }
}
