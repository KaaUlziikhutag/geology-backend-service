import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SectionProduct from './section-product.entity.js';
import { SectionProductService } from './section-product.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([SectionProduct])],
  providers: [SectionProductService],
  exports: [SectionProductService],
})
export class SectionProductModule {}
