import Appointment from '../appointment/appointment.entity';
import Payment from '../payment/payment.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import Price from '../price/price.entity';
import { OrderState } from '../../utils/enum-utils';
import Task from '../task/task.entity';
import { AbstractEntity } from '../../utils/abstract.entity';

/** Ажилын захиалга */
@Entity('appointment_orders')
export default class Order extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'payment_id', nullable: true })
  paymentId: number;
  @JoinColumn({ name: 'payment_id' })
  @ManyToOne(() => Payment, (payment) => payment.orders)
  payment?: Relation<Payment>;

  @Column({ name: 'appointment_id', nullable: true })
  appointmentId: number;
  @JoinColumn({ name: 'appointment_id' })
  @ManyToOne(() => Appointment, (appointment) => appointment.orders)
  appointment?: Relation<Appointment>;

  @Column({ name: 'price_id' })
  priceId: number;
  @JoinColumn({ name: 'price_id' })
  @ManyToOne(() => Price, (price) => price.orders)
  price?: Relation<Price>;

  @Column({ type: 'float', default: 1 })
  quantity: number;

  @Column({
    name: 'unit_price',
    type: 'numeric',
    precision: 15,
    scale: 2,
    default: 0,
  })
  unitPrice: number;

  @Column({
    name: 'addition_amount',
    type: 'numeric',
    precision: 15,
    scale: 2,
    default: 0,
  })
  additionAmount: number;

  @Column({
    name: 'discount_amount',
    type: 'numeric',
    precision: 15,
    scale: 2,
    default: 0,
  })
  discountAmount: number;

  @Column({
    name: 'paid_amount',
    type: 'numeric',
    precision: 15,
    scale: 2,
    default: 0,
  })
  paidAmount: number;

  @Column({
    name: 'total_amount',
    type: 'numeric',
    precision: 15,
    scale: 2,
    default: 0,
  })
  totalAmount: number;

  @Column({ type: 'enum', enum: OrderState, nullable: true })
  state: OrderState;

  @Column({ name: 'received_by', nullable: true })
  receivedBy: number;

  @OneToMany(() => Task, (task) => task.order)
  tasks: Task[];
}
