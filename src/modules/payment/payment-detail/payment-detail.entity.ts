import {
  EbarimtPaymentCode,
  PaymentStatus,
} from '../../../utils/enum-utils.js';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import Payment from '../payment.entity.js';
/** Төлбөр төлөлт */
@Entity('payment_details')
export default class PaymentDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'payment_id' })
  paymentId: number;
  @JoinColumn({ name: 'payment_id' })
  @ManyToOne(() => Payment, (payment) => payment.details)
  payment?: Relation<Payment>;

  @Column({
    type: 'enum',
    enum: EbarimtPaymentCode,
    default: EbarimtPaymentCode.CASH,
  })
  code: EbarimtPaymentCode;

  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus;

  @Column('varchar', { name: 'exchange_code', length: 255, nullable: true })
  exchangeCode: string; // Төлбөр хийж гүйцэтгэх гуравдагч системийн код

  @Column({
    name: 'paid_amount',
    type: 'numeric',
    precision: 15,
    scale: 2,
    default: 0,
  })
  paidAmount: number; // Төлсөн дүн
}
