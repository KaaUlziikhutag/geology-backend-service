import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import MineralType from '../reference/mineral-type/mineral-type.entity';
import Element from '../reference/element/element.entity';
import Laboratory from '../reference/laboratory/laboratory.entity';
import Technology from '../reference/technology/technology.entity';
// import Decision from '../decision/decision.entity';
import Order from '../order/order.entity';
import Inner from '@modules/decision/inner/inner.entity';
import Product from '@modules/inventory/product/product.entity';

@Entity('prices')
export default class Price extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'decision_id' })
  decisionId: number;
  // @JoinColumn({ name: 'decision_id' })
  // @ManyToOne(() => Inner)
  // decision?: Inner;

  @Column({ name: 'laboratory_id' })
  laboratoryId: number;
  @JoinColumn({ name: 'laboratory_id' })
  @ManyToOne(() => Laboratory)
  laboratory?: Laboratory;

  @Column({ name: 'product_id' })
  productId: number;
  @JoinColumn({ name: 'product_id' })
  @ManyToOne(() => Product)
  product?: Relation<Product>;

  @Column({ name: 'mineral_type_id', nullable: true })
  mineralTypeId: number;
  @JoinColumn({ name: 'mineral_type_id' })
  @ManyToOne(() => MineralType)
  mineralType?: MineralType;

  @Column({ name: 'element_id', nullable: true })
  elementId: number;
  @JoinColumn({ name: 'element_id' })
  @ManyToOne(() => Element)
  element?: Element;

  @Column({ name: 'technology_id', nullable: true })
  technologyId: number;
  @JoinColumn({ name: 'technology_id' })
  @ManyToOne(() => Technology)
  technology?: Technology;

  @Column({ name: 'is_active', type: 'boolean', default: false })
  isActive: boolean;

  @Column({ name: 'min_limit', type: 'float', nullable: true })
  minLimit: number;

  @Column({ name: 'max_limit', type: 'float', nullable: true })
  maxLimit: number;

  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
  amount: number;

  @Column({
    name: 'add_amount',
    type: 'numeric',
    precision: 15,
    scale: 2,
    default: 0,
  })
  addAmount: number;

  @OneToMany(() => Order, (order) => order.price)
  orders?: Order[];
}
