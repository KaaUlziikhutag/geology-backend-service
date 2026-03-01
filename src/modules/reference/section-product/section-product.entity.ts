import Product from '../../product/product.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
/** Үйлчилгээний бүлгүүд */
@Entity('section_products')
export default class SectionProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255, unique: true })
  code: string;

  @Column('varchar', { length: 255 })
  name: string;

  @OneToMany(() => Product, (product) => product.section)
  products?: Product[];
}
