import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Technology from './technology.entity.js';
import { TechnologyService } from './technology.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Technology])],
  providers: [TechnologyService],
  exports: [TechnologyService],
})
export class TechnologyModule {}
