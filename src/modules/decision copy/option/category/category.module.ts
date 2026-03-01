import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ContractController } from './category.contoller';
import Category from './category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), ConfigModule],
  controllers: [ContractController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class DecisionCategoryModule {}
