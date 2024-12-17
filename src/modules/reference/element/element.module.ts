import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Element from './element.entity.js';
import { ElementService } from './element.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Element])],
  providers: [ElementService],
  exports: [ElementService],
})
export class ElementModule {}
