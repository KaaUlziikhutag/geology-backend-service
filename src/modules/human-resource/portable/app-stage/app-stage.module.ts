import { Module } from '@nestjs/common';
import { AppStageService } from './app-stage.service';
import { AppStageController } from './app-stage.contoller';
import AppStages from './app-stage.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([AppStages]), ConfigModule],
  controllers: [AppStageController],
  providers: [AppStageService],
  exports: [AppStageService],
})
export class AppStageModule {}
