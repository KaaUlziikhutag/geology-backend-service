import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import Classification from '../reference/classification/classification.entity.js';
import { ProductType, TaxType } from '../../utils/enum-utils.js';
import Contract from '../contract/contract.entity.js';
import SectionProduct from '../reference/section-product/section-product.entity.js';
import Price from '../price/price.entity.js';
/** Үйлчилгээ */
@Entity('products')
export default class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'type', enum: ProductType, default: ProductType.Examination })
  type: ProductType;

  @Column({ name: 'section_id' })
  sectionId: number;
  @JoinColumn({ name: 'section_id' })
  @ManyToOne(() => SectionProduct, (section) => section.products)
  section?: Relation<SectionProduct>;

  @Column({ name: 'classification_id' })
  classificationId: number;
  @JoinColumn({ name: 'classification_id' })
  @ManyToOne(() => Classification)
  classification?: Classification;

  @Column({
    name: 'tax_type',
    type: 'enum',
    enum: TaxType,
    default: TaxType.VAT_ABLE,
  })
  taxType: TaxType; // Татварын төрөл

  @Column('varchar', { length: 255 })
  code: string;

  @Column('varchar', { length: 255 })
  name: string;

  @OneToMany(() => Price, (price) => price.product)
  prices: Price[];
}
