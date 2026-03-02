import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Product from './product.entity';
import ProductService from './product.service';
import ProductController from './product.controller';
import CategoryModule from './category/category.module';
import Category from './category/category.entity';
import VariantModule from './variant/variant.module';
import ProductVariant from './variant/variant.entity';
import Attribute from './attribute/attribute.entity';
import AttributeValue from './attribute/attribute-value/attribute-value.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Product, ProductVariant]),
    CategoryModule,
    VariantModule,
  ],
  providers: [ProductService],
  exports: [ProductService],
  controllers: [ProductController],
})
export default class ProductModule {}
