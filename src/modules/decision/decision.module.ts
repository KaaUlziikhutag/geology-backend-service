import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Decision from './decision.entity';
import { DecisionService } from './decision.service';
import { DecisionController } from './decision.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Decision])],
  providers: [DecisionService],
  controllers: [DecisionController],
})
export class DecisionModule {}
