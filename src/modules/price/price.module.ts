import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Price from './price.entity.js';
import { PriceService } from './price.service.js';
import { PriceController } from './price.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Price])],
  providers: [PriceService],
  exports: [PriceService],
  controllers: [PriceController],
})
export class PriceModule {}
