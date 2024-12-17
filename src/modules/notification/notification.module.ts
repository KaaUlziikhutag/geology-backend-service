import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway.js';
import { AuthenticationModule } from '../authentication/authentication.module.js';
import { NotificationService } from './notifcation.service.js';
import { NotificationController } from './notification.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity.js';

@Module({
  imports: [AuthenticationModule, TypeOrmModule.forFeature([Notification])],
  providers: [NotificationGateway, NotificationService],
  exports: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
