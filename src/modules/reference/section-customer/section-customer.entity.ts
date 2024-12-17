import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Customer from '../../customer/customer.entity.js';

/** Захиалагчийн бүлгүүд */
@Entity('section_customers')
export default class SectionCustomer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255, unique: true })
  code: string;

  @Column('varchar', { length: 255 })
  name: string;

  @OneToMany(() => Customer, (customer) => customer.section)
  customers: Customer[];
}
