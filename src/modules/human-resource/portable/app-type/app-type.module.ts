import { Module } from '@nestjs/common';
import { AppTypeService } from './app-type.service';
import { AppTypeController } from './app-type.contoller';
import AppTypes from './app-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([AppTypes]), ConfigModule],
  controllers: [AppTypeController],
  providers: [AppTypeService],
  exports: [AppTypeService],
})
export class AppTypeModule {}
