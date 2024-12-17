import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
import Mineral from './mineral/mineral.entity.js';
import Order from '../order/order.entity.js';
import Customer from '../customer/customer.entity.js';
import Warehouse from '../customer/warehouse/warehouse.entity.js';
import { AbstractEntity } from '../../utils/abstract.entity.js';
/** Харилцагчийн захиалга */
@Entity('appointments')
export default class Appointment extends AbstractEntity {
  @Column('varchar', { length: 255, unique: true })
  code: string;

  @Column({ name: 'customer_id' })
  customerId: number;
  @JoinColumn({ name: 'customer_id' })
  @ManyToOne(() => Customer, (customer) => customer.appointments)
  customer?: Relation<Customer>;

  @Column({ name: 'warehouse_id', nullable: true })
  warehouseId: number;
  @JoinColumn({ name: 'warehouse_id' })
  @ManyToOne(() => Warehouse)
  warehouse?: Warehouse;

  @Column({ name: 'is_duplicate', nullable: true })
  isDuplicate: boolean;

  @Column({ name: 'is_analytic', default: false })
  isAnalytic: boolean;

  @Column('varchar', { length: 255, nullable: true })
  description: string; // тусгай тэмдэглэл

  @Column('varchar', { length: 255, nullable: true })
  delivered: string; // хүлээлгэж өгсөн

  @Column('varchar', { length: 255, nullable: true })
  received: string; // хүлээн авсан

  @OneToMany(() => Mineral, (mineral) => mineral.appointment)
  minerals: Mineral[];

  @OneToMany(() => Order, (order) => order.appointment)
  orders: Order[];
}
