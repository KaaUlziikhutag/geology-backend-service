import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import Product from '../product.entity';
import AttributeValue from '../attribute/attribute-value/attribute-value.entity';
import { DecimalTransformer } from '@utils/transformer';
import { AbstractEntity } from '@utils/abstract.entity';

@Entity('product_variants')
export default class ProductVariant extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id', nullable: true })
  productId: string;
  @JoinColumn({ name: 'product_id' })
  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  product?: Relation<Product>;

  @Column({ nullable: true })
  name: string;

  @Column()
  sku: string;

  @Column({ type: 'decimal', transformer: DecimalTransformer })
  price: number;

  @Column({
    name: 'discount_price',
    type: 'decimal',
    default: 0,
    transformer: DecimalTransformer,
  })
  discountPrice: number;

  @Column({ type: 'int' })
  stock: number;

  @ManyToMany(
    () => AttributeValue,
    (attributeValue) => attributeValue.variants,
    { cascade: true },
  )
  @JoinTable({
    name: 'product_variant_attribute_values',
    joinColumn: { name: 'variant_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'attribute_value_id',
      referencedColumnName: 'id',
    },
  })
  attributeValues?: AttributeValue[];
}
