import { Module } from '@nestjs/common';
import { ApplicantGroupService } from './applicant-group.service';
import ApplicantGroups from './applicant-group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicantGroups]), ConfigModule],
  providers: [ApplicantGroupService],
  exports: [ApplicantGroupService],
})
export class ApplicantGroupModule {}
