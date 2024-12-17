import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Addition from './addition.entity.js';
import { AdditionService } from './addition.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Addition])],
  providers: [AdditionService],
  exports: [AdditionService],
})
export class AdditionModule {}
