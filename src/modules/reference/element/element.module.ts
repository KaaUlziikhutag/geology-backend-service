import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Element from './element.entity';
import { ElementService } from './element.service';

@Module({
  imports: [TypeOrmModule.forFeature([Element])],
  providers: [ElementService],
  exports: [ElementService],
})
export class ElementModule {}
