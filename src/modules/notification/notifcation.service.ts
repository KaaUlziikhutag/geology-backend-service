import {
  DeleteResult,
  Equal,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Notification } from './notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationGateway } from './notification.gateway';
import GetUserDto from '../users/dto/get-user.dto';
import { GetNotificationDto } from './dto/get-notification.dto';
import IUser from '@modules/users/interface/user.interface';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async createNotification(
    user: IUser,
    notification: CreateNotificationDto,
  ): Promise<Notification> {
    const newNotification = this.notificationRepository.create({
      ...notification,
      createdBy: user.id,
    });
    this.notificationGateway.handleNotifcation(notification.receiverId, true);
    return this.notificationRepository.save(newNotification);
  }

  async getNotifications(query: GetNotificationDto): Promise<Notification[]> {
    const where: FindOptionsWhere<Notification> = {
      receiverId: query.receiverId,
    };
    if (query.isRead) {
      where.isRead = Equal(query.isRead);
    }
    return this.notificationRepository.find({
      where,
      relations: ['createdUser'],
    });
  }

  async updateNotification(id: number): Promise<UpdateResult> {
    return await this.notificationRepository.update(id, { isRead: true });
  }

  async deleteNotification(id: number): Promise<DeleteResult> {
    return await this.notificationRepository.delete(id);
  }
}
