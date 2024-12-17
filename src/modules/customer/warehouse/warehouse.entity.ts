import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import Customer from '../customer.entity.js';
/** Захиалагчийн агуулхууд */
@Entity('customer_warehouses')
export default class Warehouse extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'customer_id' })
  customerId: number;
  @JoinColumn({ name: 'customer_id' })
  @ManyToOne(() => Customer, (customer) => customer.warehouses)
  customer?: Relation<Customer>;

  @Column('varchar', { length: 255 })
  code: string;

  @Column('varchar', { length: 255 })
  name: string;
}
