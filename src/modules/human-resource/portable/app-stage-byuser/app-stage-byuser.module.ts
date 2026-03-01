import { Module } from '@nestjs/common';
import { AppStageByUserService } from './app-stage-byuser.service';
import { AppStageByUserController } from './app-stage-byuser.contoller';
import AppStageByUsers from './app-stage-byuser.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([AppStageByUsers]), ConfigModule],
  controllers: [AppStageByUserController],
  providers: [AppStageByUserService],
  exports: [AppStageByUserService],
})
export class AppStageByUserModule {}
