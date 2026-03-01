import { Module } from '@nestjs/common';
import { SupervisorService } from './supervisor.service';
import { SupervisorController } from './supervisor.contoller';
import Supervisor from './entity/supervisor.entity';
import SupervisorByusers from './entity/supervisor-byuser.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Supervisor, SupervisorByusers]),
    ConfigModule,
  ],
  controllers: [SupervisorController],
  providers: [SupervisorService],
  exports: [SupervisorService],
})
export class TimeSupervisorModule {}
