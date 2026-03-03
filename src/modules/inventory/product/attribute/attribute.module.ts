import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Attribute from './attribute.entity';
import AttributeService from './attribute.service';
import AttributeController from './attribute.controller';
import CategoryModule from '../category/category.module';
import AttributeValue from './attribute-value/attribute-value.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attribute, AttributeValue]), CategoryModule],
  providers: [AttributeService],
  controllers: [AttributeController],
})
export default class AttributeModule {}
