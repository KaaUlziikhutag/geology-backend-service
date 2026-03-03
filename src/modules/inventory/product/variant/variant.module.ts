import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ProductVariant from './variant.entity';
import VariantService from './variant.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariant])],
  providers: [VariantService],
  exports: [VariantService],
})
export default class VariantModule {}
