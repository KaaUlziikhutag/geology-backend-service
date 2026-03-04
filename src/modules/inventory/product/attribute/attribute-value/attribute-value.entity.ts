import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Attribute from '../attribute.entity';
import { AbstractEntity } from '@utils/abstract.entity';
import ProductVariant from '../../variant/variant.entity';

@Entity('attribute_values')
export default class AttributeValue extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'attribute_id', nullable: true })
  attributeId: number;
  @JoinColumn({ name: 'attribute_id' })
  @ManyToOne(() => Attribute, (attribute) => attribute.values, {
    onDelete: 'CASCADE',
  })
  attribute?: Attribute;

  @Column()
  value: string;

  @ManyToMany(() => ProductVariant, (variant) => variant.attributeValues)
  variants?: ProductVariant[];
}
