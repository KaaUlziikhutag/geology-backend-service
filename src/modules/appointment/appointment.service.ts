import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Appointment from './appointment.entity';
import {
  Between,
  Equal,
  FindManyOptions,
  ILike,
  IsNull,
  Repository,
} from 'typeorm';
import CreateAppointmentDto from './dto/create-appointment.dto';
import GetAppointmentDto from './dto/get-appointment.dto';
import PageMetaDto from '../../utils/dto/page-meta.dto';
import PageDto from '../../utils/dto/page.dto';
import { getCode, today } from '../../utils/helper-utils';
import AppointmentNotFoundException from './exceptions/appointment-not-found.exception';
import UpdateAppointmentDto from './dto/update-appointment.dto';
import * as ejs from 'ejs';
import { join } from 'path';
import moment from 'moment';
import GetUserDto from '../users/dto/get-user.dto';
import { ReceiptStatus } from '../../utils/enum-utils';
import IUser from '@modules/cloud/user/interface/user.interface';
@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async createAppointment(
    user: IUser,
    appointment: CreateAppointmentDto,
  ): Promise<Appointment> {
    const countAppointment = await this.getCountAppointment({
      createdAt: today(),
      skip: 0,
    });
    const newAppointment = this.appointmentRepository.create({
      code: getCode('OR', countAppointment + 1),
      ...appointment,
      createdBy: user.id,
    });
    return await newAppointment.save();
  }

  async getCountAppointment(query: GetAppointmentDto): Promise<number> {
    const where: FindManyOptions<Appointment>['where'] = {};
    if (query.createdAt) {
      where.createdAt = Between(query.createdAt.startAt, query.createdAt.endAt);
    }
    return await this.appointmentRepository.count({ where });
  }
  async getAllAppointment(query: GetAppointmentDto) {
    const { page, skip, limit, order } = query;
    const where: FindManyOptions<Appointment>['where'] = {};
    if (query.search) {
      where.customer = [
        { regno: ILike(`%${query.search}%`) },
        { name: ILike(`%${query.search}%`) },
        { addName: ILike(`%${query.search}%`) },
        { email: ILike(`%${query.search}%`) },
        { phone: ILike(`%${query.search}%`) },
        { addPhone: ILike(`%${query.search}%`) },
        { address: ILike(`%${query.search}%`) },
      ];
    }
    if (query.createdAt) {
      where.createdAt = Between(query.createdAt.startAt, query.createdAt.endAt);
    }
    if (query.paymentStatus) {
      where.orders = {
        payment: { status: Equal(query.paymentStatus) },
      };
    } else if (query.paymentStatus == ReceiptStatus.PAY) {
      where.orders = { paymentId: IsNull() };
    }
    const [items, itemCount] = await this.appointmentRepository.findAndCount({
      where,
      skip,
      take: limit,
      relations: [
        'customer',
        'customer.direction',
        'customer.section',
        'warehouse',
      ],
      order: { createdAt: order },
    });
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }
  async getAppointmentById(id: number) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: [
        'customer',
        'warehouse',
        'minerals',
        'minerals.mineralType',
        'orders',
        'orders.tasks',
      ],
    });
    if (appointment) {
      return appointment;
    }
    throw new AppointmentNotFoundException(id);
  }
  async updateAppointment(
    id: number,
    appointment: UpdateAppointmentDto,
  ): Promise<Appointment> {
    await this.appointmentRepository.update(id, appointment);
    return await this.getAppointmentById(id);
  }
  async deleteAppointment(id: number): Promise<void> {
    const deleteResponse = await this.appointmentRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new AppointmentNotFoundException(id);
    }
  }
  async pdfAppointmentById(id: number) {
    const appointment = await this.getAppointmentById(id);
    const content = await ejs.renderFile(
      join(`${process.cwd()}/src/templates/appointment.ejs`),
      {
        ...appointment,
        createdAt: moment(appointment.createdAt).format('YYYY-MM-DD'),
      },
    );
    return content;
  }
}
