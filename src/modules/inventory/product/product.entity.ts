import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import ProductVariant from './variant/variant.entity';
import { ProductType } from '@utils/enum-utils';
import { AbstractEntity } from '@utils/abstract.entity';
import Trees from '@modules/human-resource/tree/tree.entity';

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

  @Column({
    type: 'decimal',
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  price: number;

  @Column({
    name: 'discount_price',
    type: 'decimal',
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  discountPrice: number;

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
  })
  variants: ProductVariant[];

  @ManyToMany(() => Trees, { cascade: true })
  @JoinTable({
    name: 'products_trees',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tree_id', referencedColumnName: 'id' },
  })
  categories: Trees[];
}
