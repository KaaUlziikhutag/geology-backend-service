import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Discount from './discount.entity.js';
import { DiscountService } from './discount.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Discount])],
  providers: [DiscountService],
  exports: [DiscountService],
})
export class DiscountModule {}
