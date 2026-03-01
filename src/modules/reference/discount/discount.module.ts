import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Discount from './discount.entity';
import { DiscountService } from './discount.service';

@Module({
  imports: [TypeOrmModule.forFeature([Discount])],
  providers: [DiscountService],
  exports: [DiscountService],
})
export class DiscountModule {}
