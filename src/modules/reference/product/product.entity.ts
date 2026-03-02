import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
import ProductVariant from './variant/variant.entity';
import Category from './category/category.entity';
import { ProductType } from '@utils/enum-utils';
import { AbstractEntity } from '@utils/abstract.entity';

@Entity('products')
export default class Product extends AbstractEntity {
  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'is_feature', type: 'boolean', nullable: true })
  isFeature: boolean;

  @Column({
    name: 'type',
    enum: ProductType,
    default: ProductType.single,
    nullable: true,
  })
  type: ProductType;

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
  })
  variants: ProductVariant[];

  @ManyToMany(() => Category, { cascade: true })
  @JoinTable({
    name: 'products_categories',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];
}
