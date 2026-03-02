import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import Attribute from '../attribute.entity';
import { AbstractEntity } from '@utils/abstract.entity';
import ProductVariant from '../../variant/variant.entity';

@Entity('attribute_values')
export default class AttributeValue extends AbstractEntity {
  @Column({ name: 'attribute_id', nullable: true })
  attributeId: number;
  @JoinColumn({ name: 'attribute_id' })
  @ManyToOne(() => Attribute, (attribute) => attribute.values, {
    onDelete: 'CASCADE',
  })
  attribute?: Relation<Attribute>;

  @Column()
  value: string;

  @ManyToMany(() => ProductVariant, (variant) => variant.attributeValues)
  variants?: ProductVariant[];
}
