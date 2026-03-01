import { Module } from '@nestjs/common';
import { GraphicService } from './graphic.service';
import { GraphicController } from './graphic.contoller';
import Graphic from './entity/graphic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Graphic]), ConfigModule],
  controllers: [GraphicController],
  providers: [GraphicService],
  exports: [GraphicService],
})
export class RepeatGraphicModule {}
