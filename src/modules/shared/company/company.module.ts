import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.contoller';
import Companys from '../access/entities/company-limit.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Companys]), ConfigModule],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
