import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notifcation.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { IResponse } from '../../utils/interfaces/response.interface';
import { ResponseSuccess } from '../../utils/dto/response.dto';
import FindOneParams from '../../utils/find-one-params';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';
import { GetNotificationDto } from './dto/get-notification.dto';

@Controller('notification')
@ApiTags('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async createNotification(
    @Req() { user }: RequestWithUser,
    @Body() notification: CreateNotificationDto,
  ): Promise<IResponse> {
    try {
      const data = await this.notificationService.createNotification(
        user,
        notification,
      );
      return new ResponseSuccess('CREATE_NOTIFICATION', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get()
  async getNotifications(
    @Query() query: GetNotificationDto,
  ): Promise<IResponse> {
    const data = await this.notificationService.getNotifications(query);
    return new ResponseSuccess('GET_NOTIFICATION', data);
  }
  @Patch(':id')
  async updateNotification(@Param() { id }: FindOneParams): Promise<IResponse> {
    const data = await this.notificationService.updateNotification(id);
    return new ResponseSuccess('UPDATE_NOTIFICATION', data);
  }
  @Delete(':id')
  async deleteNotification(@Param() { id }: FindOneParams): Promise<IResponse> {
    const data = await this.notificationService.deleteNotification(id);
    return new ResponseSuccess('DELETE_NOTIFICATION', data);
  }
}
