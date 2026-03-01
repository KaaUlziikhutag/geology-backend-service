import { Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { GetDoctorDto } from './dto/get-doctor.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Doctors from './doctor.entity';
import DoctorNotFoundException from './exceptions/doctor-not-found.exception';
import { PageDto } from '../../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../cloud/user/dto/get-user.dto';

@Injectable()
export class DoctorService {
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
   * A method that fetches the Doctor from the database
   * @returns A promise with the list of Doctors
   */
  async getAllDoctors(query: GetDoctorDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Doctors>['where'] = {};
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

    let limit: number | undefined;

    if (query.limit && !isNaN(query.limit) && query.limit > 0) {
      limit = Number(query.limit);
    }

    const skip = (page - 1) * (limit || 0);

    const [items, count] = await entityManager.findAndCount(Doctors, {
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
   * A method that fetches a Doctor with a given id. Example:
   *
   * @example
   * const Doctor = await DoctorService.getDoctorById(1);
   */
  async getDoctorById(doctorId: number, user: GetUserDto): Promise<Doctors> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const doctor = await entityManager.findOne(Doctors, {
      where: { id: doctorId },
    });
    if (doctor) {
      return doctor;
    }
    throw new DoctorNotFoundException(doctorId);
  }

  /**
   *
   * @param Doctor createDoctor
   *
   */
  async createDoctor(doctor: CreateDoctorDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    doctor.authorId = user.workerId;
    const newDoctor = entityManager.create(Doctors, doctor);
    await entityManager.save(newDoctor);
    return newDoctor;
  }

  /**
   * See the [definition of the UpdateDoctorDto file]{@link UpdateDoctorDto} to see a list of required properties
   */
  async updateDoctor(
    id: number,
    user: GetUserDto,
    doctor: UpdateDoctorDto,
  ): Promise<Doctors> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Doctors, id, doctor);
    const updatedDoctor = await entityManager.findOne(Doctors, {
      where: { id: id },
    });
    if (updatedDoctor) {
      return updatedDoctor;
    }
    throw new DoctorNotFoundException(id);
  }

  /**
   * @deprecated Use deleteDoctor instead
   */
  async deleteDoctorById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteDoctor(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteDoctor(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Doctors, id);
    if (!deleteResponse.affected) {
      throw new DoctorNotFoundException(id);
    }
  }
}
