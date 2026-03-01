import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Technology from './technology.entity';
import { TechnologyService } from './technology.service';

@Module({
  imports: [TypeOrmModule.forFeature([Technology])],
  providers: [TechnologyService],
  exports: [TechnologyService],
})
export class TechnologyModule {}
