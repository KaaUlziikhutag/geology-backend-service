import { Injectable } from '@nestjs/common';
import {
  UpdateAppointmentDto,
  UpdatedAppointmentWithShift,
} from './dto/update-appointment.dto';
import { GetAppointmentDto } from './dto/get-appointment.dto';
import { Between, EntityManager, Equal, FindManyOptions, In } from 'typeorm';
import Appointment from './entities/appointment.entity';
import AppointmentNotFoundException from './exceptions/appointment-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import AppointmentByuser from './entities/appointment-byuser.entity';
import AppointmentShifts from './entities/appointment-shift.entity';
import Worker from '../member/worker/worker.entity';
import {
  AccessType,
  AppointmentStatusType,
  DateType,
  WorkType,
} from '@utils/enum-utils';
import AppointmentCloses from './entities/appointment-close.entity';
import IUser from '@modules/users/interface/user.interface';

@Injectable()
export class AppointmentService {
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
   * A method that fetches the Appointment from the database
   * @returns A promise with the list of Appointments
   */
  async getAllAppointments(query: GetAppointmentDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Appointment>['where'] = {};
    const { skip, limit, page } = query;
    if (query.authorId) {
      where.authorId = Equal(query.authorId);
    }
    if (query.holderId) {
      where.holderId = Equal(query.holderId);
    }
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    if (query.accessType == AccessType.Simple) {
      where.appointmentByusers = [{ userId: Equal(user.id) }];
    }
    if (query.status) {
      where.status = Equal(query.status);
    }
    if (query.ids) {
      const id = [];
      id.push(...query.ids.split(','));
      where.id = In(id);
    }
    if (query.type == DateType.Start) {
      where.startDate = Between(query.startDate, query.endDate);
    }
    if (query.type == DateType.End) {
      where.endDate = Between(query.startDate, query.endDate);
    }
    if (query.type == DateType.Create) {
      where.createdAt = Between(query.startDate, query.endDate);
    }
    if (query.workerId) {
      where.appointmentByusers = {
        userId: Equal(query.workerId),
      };
    }

    const [items, count] = await entityManager.findAndCount(Appointment, {
      where,
      order: {
        createdAt: 'DESC',
      },
      skip,
      take: limit,
      relations: [
        'appointmentByusers',
        'appointmentByusers.workers',
        'appointmentByusers.workers.humans',
      ],
    });
    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return {
      items: new PageDto(items, pageMetaDto),
    };
  }

  async getAllAppointmentShift(query: GetAppointmentDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<AppointmentShifts>['where'] = {};
    const { skip, limit, page } = query;
    if (query.authorId) {
      where.authorId = Equal(query.authorId);
    }
    if (query.itemId) {
      where.itemId = Equal(query.itemId);
    }
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    if (query.startDate) {
      where.shiftDate = Between(query.startDate, query.endDate);
    }

    const [items, count] = await entityManager.findAndCount(AppointmentShifts, {
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
   * A method that fetches a Appointment with a given id. Example:
   *
   * @example
   * const Appointment = await AppointmentService.getAppointmentById(1);
   */
  async getAppointmentById(
    appointmentId: number,
    user: IUser,
  ): Promise<Appointment> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const appointment = await entityManager.findOne(Appointment, {
      where: { id: appointmentId },
      relations: [
        'appointmentByusers',
        'appointmentByusers.workers',
        'appointmentByusers.workers.humans',
      ],
    });
    if (appointment) {
      return appointment;
    }
    throw new AppointmentNotFoundException(appointmentId);
  }

  /**
   *
   * @param Appointment createAppointment
   *
   */
  async createAppointment(appointment: Partial<Appointment>, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    appointment.receiverId = appointment.holderId;
    appointment.authorId = user.id;
    appointment.status = AppointmentStatusType.Expected;
    appointment.workerType = WorkType.Appointment;
    // appointment.authorName = `${user.lastName} ${user.firstName}`;
    const newAppointment = entityManager.create(Appointment, appointment);
    await entityManager.save(newAppointment);
    if (appointment.workerIds) {
      for (const id of appointment.workerIds) {
        const newAppointmentByuser = await entityManager.create(
          AppointmentByuser,
          {
            itemId: newAppointment.id,
            userId: id,
            isNew: false,
          },
        );
        await entityManager.save(newAppointmentByuser);
      }
    }
    const newAppointmentShift = await entityManager.create(AppointmentShifts, {
      itemId: newAppointment.id,
      comId: null,
      status: newAppointment.status,
      receiverId: newAppointment.holderId,
      authorName: newAppointment.holderUserName,
      authorId: newAppointment.holderId,
    });
    await entityManager.save(newAppointmentShift);
    return newAppointment;
  }

  /**
   * See the [definition of the UpdateAppointmentDto file]{@link UpdateAppointmentDto} to see a list of required properties
   */
  async updateAppointment(
    id: number,
    user: IUser,
    appointment: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Appointment, id, appointment);
    const updatedAppointment = await entityManager.findOne(Appointment, {
      where: { id: id },
    });

    if (!updatedAppointment) {
      throw new AppointmentNotFoundException(id);
    }
    return updatedAppointment;
  }

  async updateAppointmentConfirm(
    ids: number[],
    user: IUser,
    appointment: UpdateAppointmentDto,
  ): Promise<UpdatedAppointmentWithShift[]> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    appointment.status = AppointmentStatusType.Comfirm;
    const updatedResults: UpdatedAppointmentWithShift[] = [];

    for (const id of ids) {
      // Update appointment
      await entityManager.update(Appointment, id, appointment);
      const updatedAppointment = await entityManager.findOne(Appointment, {
        where: { id: id },
      });

      if (!updatedAppointment) {
        throw new AppointmentNotFoundException(id);
      }
      // Update appointmentShift
      const newAppointmentShift = await entityManager.create(
        AppointmentShifts,
        {
          itemId: updatedAppointment.id,
          confirmId: user.id,
          authorId: user.id,
          authorName: appointment.holderUserName,
          status: updatedAppointment.status,
          confirmDate: new Date(),
        },
      );

      await entityManager.save(newAppointmentShift);
      const updatedAppointmentShift = await entityManager.findOne(
        AppointmentShifts,
        {
          where: { itemId: id },
        },
      );
      const date = new Date();
      const dateOnly = date.toISOString().split('T')[0];
      const startDateOnly = updatedAppointment.startDate
        .toISOString()
        .split('T')[0];
      if (startDateOnly === dateOnly) {
        console.log('orloooooooooo');
        if (updatedAppointment.workerIds) {
          for (const workerId of updatedAppointment.workerIds) {
            await entityManager.update(
              Worker,
              { id: workerId },
              {
                workerType: updatedAppointment.workerType,
              },
            );
          }
        }
      }
      updatedResults.push({
        appointment: updatedAppointment,
        appointmentShift: updatedAppointmentShift,
      });
    }
    return updatedResults;
  }

  async updateAppointmentTransfer(
    ids: number[],
    user: IUser,
    appointment: UpdateAppointmentDto,
  ): Promise<UpdatedAppointmentWithShift[]> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const updatedResults: UpdatedAppointmentWithShift[] = [];
    for (const id of ids) {
      appointment.status = AppointmentStatusType.Expected;
      await entityManager.update(Appointment, id, appointment);
      const updatedAppointment = await entityManager.findOne(Appointment, {
        where: { id: id },
      });

      if (!updatedAppointment) {
        throw new AppointmentNotFoundException(id);
      }
      // Create appointment shift
      const reveiverData = await entityManager.findOne(AppointmentShifts, {
        where: {
          itemId: id,
          status: AppointmentStatusType.Expected,
        },
        order: {
          createdAt: 'DESC',
        },
      });
      if (!reveiverData) {
        throw new Error(
          `Receiver data not found for appointment with ID ${id}`,
        );
      }
      const newAppointmentShiftdata = entityManager.create(AppointmentShifts, {
        itemId: id,
        shiftDate: new Date(),
        comId: null,
        authorId: reveiverData.authorId,
        status: AppointmentStatusType.Transfer,
        authorName: reveiverData.authorName,
        note: reveiverData.note,
        receiverId: reveiverData.authorId,
      });
      await entityManager.save(newAppointmentShiftdata);
      const newAppointmentShift = await entityManager.create(
        AppointmentShifts,
        {
          itemId: updatedAppointment.id,
          shiftDate: new Date(),
          comId: null,
          authorId: user.id,
          status: AppointmentStatusType.Expected,
          authorName: updatedAppointment.holderUserName,
          note: updatedAppointment.note,
          receiverId: appointment.authorId,
        },
      );
      await entityManager.save(newAppointmentShift);
      updatedResults.push({
        appointment: updatedAppointment,
        appointmentShift: newAppointmentShift,
        appointmentShifts: newAppointmentShiftdata,
      });
    }
    return updatedResults;
  }

  async updateAppointmentCancelled(
    ids: number[],
    user: IUser,
    appointment: UpdateAppointmentDto,
  ): Promise<UpdatedAppointmentWithShift[]> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    appointment.status = AppointmentStatusType.Cancelled;
    const updatedResults: UpdatedAppointmentWithShift[] = [];
    for (const id of ids) {
      await entityManager.update(Appointment, id, appointment);
      const updatedAppointment = await entityManager.findOne(Appointment, {
        where: { id: id },
      });
      if (!updatedAppointment) {
        throw new AppointmentNotFoundException(id);
      }
      const newAppointmentShift = await entityManager.create(
        AppointmentShifts,
        {
          itemId: updatedAppointment.id,
          confirmId: user.id,
          authorId: user.id,
          authorName: appointment.holderUserName,
          note: appointment.note,
          status: updatedAppointment.status,
          confirmDate: new Date(),
        },
      );
      await entityManager.save(newAppointmentShift);
      const newAppointmentClose = entityManager.create(AppointmentCloses, {
        itemId: updatedAppointment.id,
        note: appointment.note,
        fdate: new Date(),
      });
      await entityManager.save(newAppointmentClose);
      updatedResults.push({
        appointment: updatedAppointment,
        appointmentCloses: newAppointmentClose,
      });

      if (updatedAppointment.workerIds) {
        for (const workerId of updatedAppointment.workerIds) {
          await entityManager.update(
            Worker,
            { id: workerId },
            {
              workerType: WorkType.Active,
            },
          );
        }
      }
    }
    return updatedResults;
  }

  /**
   * @deprecated Use deleteAppointment instead
   */
  async deleteAppointmentById(id: number, user: IUser): Promise<void> {
    return this.deleteAppointment(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteAppointment(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Appointment, id);
    if (!deleteResponse.affected) {
      throw new AppointmentNotFoundException(id);
    }
  }
}
