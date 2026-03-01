import { Module } from '@nestjs/common';
import { DecisionTypeService } from './type.service';
import { DecisionTypeController } from './type.contoller';
import Type from './type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Type]), ConfigModule],
  controllers: [DecisionTypeController],
  providers: [DecisionTypeService],
  exports: [DecisionTypeService],
})
export class DesicionTypeModule {}
