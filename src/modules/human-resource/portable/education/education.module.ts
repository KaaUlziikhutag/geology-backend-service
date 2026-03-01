import { Module } from '@nestjs/common';
import { EducationService } from './education.service';
import { EducationController } from './education.contoller';
import Educations from './education.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Educations]), ConfigModule],
  controllers: [EducationController],
  providers: [EducationService],
  exports: [EducationService],
})
export class EducationModule {}
