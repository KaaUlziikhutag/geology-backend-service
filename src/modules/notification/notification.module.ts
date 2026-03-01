import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { AuthenticationModule } from '../authentication/authentication.module';
import { NotificationService } from './notifcation.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';

@Module({
  imports: [AuthenticationModule, TypeOrmModule.forFeature([Notification])],
  providers: [NotificationGateway, NotificationService],
  exports: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
