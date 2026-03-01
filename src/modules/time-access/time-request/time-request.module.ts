import { Module } from '@nestjs/common';
import { TimeRequestService } from './time-request.service';
import { TimeRequestController } from './time-request.contoller';
import TimeRequests from './time-request.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([TimeRequests]), ConfigModule],
  controllers: [TimeRequestController],
  providers: [TimeRequestService],
  exports: [TimeRequestService],
})
export class TimeRequestModule {}
