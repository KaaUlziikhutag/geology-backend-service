import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Decision from './decision.entity.js';
import { DecisionService } from './decision.service.js';
import { DecisionController } from './decision.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Decision])],
  providers: [DecisionService],
  controllers: [DecisionController],
})
export class DecisionModule {}
