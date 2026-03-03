import { Module } from '@nestjs/common';
import { CustomerModule } from '../customer/customer.module';
import ProductModule from './product/product.module';
import AttributeModule from './product/attribute/attribute.module';

@Module({
  imports: [AttributeModule, ProductModule],
})
export class InventoryModule {}
