import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Measurement from '../reference/measurement/measurement.entity';
import Product from '../product/product.entity';
import Element from '../reference/element/element.entity';
/** Үзүүлэлт */
@Entity('indicators')
export default class Indicator extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'min_limit', type: 'float', nullable: true })
  minLimit: number;

  @Column({ name: 'max_limit', type: 'float', nullable: true })
  maxLimit: number;

  @Column({ name: 'measurement_id' })
  measurementId: number;
  @JoinColumn({ name: 'measurement_id' })
  @ManyToOne(() => Measurement)
  measurement?: Measurement;

  @Column({ name: 'product_id' })
  productId: number;
  @JoinColumn({ name: 'product_id' })
  @ManyToOne(() => Product)
  product?: Product;

  @Column({ name: 'element_id' })
  elementId: number;
  @JoinColumn({ name: 'element_id' })
  @ManyToOne(() => Element)
  element?: Element;
}
