import { CustomerType } from '../../utils/enum-utils';
import {
  Entity,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
  Relation,
} from 'typeorm';
import Warehouse from './warehouse/warehouse.entity';
import { Direction } from '../reference/direction/direction.entity';
import Section from '../reference/section-customer/section-customer.entity';
import { AbstractEntity } from '../../utils/abstract.entity';
import Province from '../reference/address/province.entity';
import District from '../reference/address/district.entity';
import Appointment from '../appointment/appointment.entity';
import Payment from '../payment/payment.entity';
/** Үйлчлүүлэгч */
@Entity('customers')
export default class Customer extends AbstractEntity {
  @Column({ name: 'direction_id', nullable: true })
  directionId: number; // байгууллагын үйл ажиллагааны чиглэл
  @JoinColumn({ name: 'direction_id' })
  @ManyToOne(() => Direction)
  direction?: Relation<Direction>;

  @Column({ name: 'section_id', nullable: true })
  sectionId: number; // байгууллагын бүлэглэлт
  @JoinColumn({ name: 'section_id' })
  @ManyToOne(() => Section, (section) => section.customers)
  section?: Relation<Section>;

  @Column({ type: 'enum', enum: CustomerType })
  type: CustomerType;

  @Column('varchar', { unique: true, length: 10 })
  regno: string;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { name: 'add_name', length: 255, nullable: true })
  addName: string; // Захирал нэр, Овог

  @Column('varchar', { length: 255, nullable: true })
  email: string;

  @Column('varchar', { length: 10 })
  phone: string;

  @Column('varchar', { name: 'add_phone', length: 10, nullable: true })
  addPhone: string;

  @Column({ name: 'province_id', nullable: true })
  provinceId: number;
  @JoinColumn({ name: 'province_id' })
  @ManyToOne(() => Province)
  province?: Province;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;
  @JoinColumn({ name: 'district_id' })
  @ManyToOne(() => District)
  district?: District;

  @Column('text', { nullable: true })
  address: string;

  @Column('varchar', { name: 'ebarimt_tin', length: 100, nullable: true })
  ebarimtTin: string;

  @Column('varchar', { name: 'ebarimt_no', length: 100, nullable: true })
  ebarimtNo: string;

  @OneToMany(() => Warehouse, (warehouse) => warehouse.customer)
  warehouses?: Warehouse[];

  @OneToMany(() => Appointment, (appointment) => appointment.customer)
  appointments?: Appointment[];

  @OneToMany(() => Payment, (payment) => payment.customer)
  payments?: Payment[];
}
