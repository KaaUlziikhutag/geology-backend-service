import { Injectable } from '@nestjs/common';
import { CreateSalaryDto } from './dto/create-salary.dto';
import { UpdateSalaryDto } from './dto/update-salary.dto';
import { GetSalaryDto } from './dto/get-salary.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Salary from './salary.entity';
import SalaryNotFoundException from './exceptions/salary-not-found.exception';
import { PageDto } from '../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../cloud/user/dto/get-user.dto';

@Injectable()
export class SalaryService {
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
   * A method that fetches the Salary from the database
   * @returns A promise with the list of Salarys
   */
  async getAllSalarys(query: GetSalaryDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Salary>['where'] = {};
    if (query.autorId) {
      where.autorId = Equal(query.autorId);
    }
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    const skip = (query.page - 1) * query.limit;

    const [items, count] = await entityManager.findAndCount(Salary, {
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
   * A method that fetches a Salary with a given id. Example:
   *
   * @example
   * const Salary = await SalaryService.getSalaryById(1);
   */
  async getSalaryById(salaryId: number, user: GetUserDto): Promise<Salary> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const salary = await entityManager.findOne(Salary, {
      where: { id: salaryId },
    });
    if (salary) {
      return salary;
    }
    throw new SalaryNotFoundException(salaryId);
  }

  /**
   *
   * @param Salary createSalary
   *
   */
  async createSalary(salary: CreateSalaryDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newSalary = entityManager.create(Salary, salary);
    await entityManager.save(newSalary);
    return newSalary;
  }

  /**
   * See the [definition of the UpdateSalaryDto file]{@link UpdateSalaryDto} to see a list of required properties
   */
  async updateSalary(
    id: number,
    user: GetUserDto,
    salary: UpdateSalaryDto,
  ): Promise<Salary> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Salary, id, salary);
    const updatedSalary = await entityManager.findOne(Salary, {
      where: { id: id },
    });
    if (updatedSalary) {
      return updatedSalary;
    }
    throw new SalaryNotFoundException(id);
  }

  /**
   * @deprecated Use deleteSalary instead
   */
  async deleteSalaryById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteSalary(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteSalary(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(Salary, id);
    if (!deleteResponse.affected) {
      throw new SalaryNotFoundException(id);
    }
  }
}
