import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SectionProduct from './section-product.entity';
import { SectionProductService } from './section-product.service';

@Module({
  imports: [TypeOrmModule.forFeature([SectionProduct])],
  providers: [SectionProductService],
  exports: [SectionProductService],
})
export class SectionProductModule {}
