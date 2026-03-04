import { EbarimtTaxType, ReceiptStatus } from '../../utils/enum-utils';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Order from '../order/order.entity';
import PaymentDetail from './payment-detail/payment-detail.entity';
import Customer from '../customer/customer.entity';
import Discount from '../reference/discount/discount.entity';
import Addition from '../reference/addition/addition.entity';
import Contract from '../contract/contract.entity';
/** Төлбөрийн баримт */
@Entity('payments')
export default class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'customer_id' })
  customerId: number;
  @JoinColumn({ name: 'customer_id' })
  @ManyToOne(() => Customer, (customer) => customer.payments)
  customer?: Customer;

  @Column({ name: 'contract_id', nullable: true })
  contractId: number;
  @JoinColumn({ name: 'contract_id' })
  @ManyToOne(() => Contract)
  contract?: Contract;

  @Column({ name: 'discount_id', nullable: true })
  discountId: number;
  @JoinColumn({ name: 'discount_id' })
  @ManyToOne(() => Discount)
  discount?: Discount;

  @Column({ name: 'addition_id', nullable: true })
  additionId: number;
  @JoinColumn({ name: 'addition_id' })
  @ManyToOne(() => Addition)
  addition?: Addition;

  @Column({ type: 'enum', enum: ReceiptStatus, default: ReceiptStatus.PAY })
  status: ReceiptStatus;

  @Column({
    type: 'enum',
    enum: EbarimtTaxType,
    default: EbarimtTaxType.B2C_RECEIPT,
  })
  type: EbarimtTaxType;

  @Column('varchar', { length: 255, nullable: true })
  description: string;

  @Column({
    name: 'discount_amount',
    type: 'numeric',
    precision: 15,
    scale: 2,
    default: 0,
  })
  discountAmount: number;

  @Column({
    name: 'addition_amount',
    type: 'numeric',
    precision: 15,
    scale: 2,
    default: 0,
  })
  additionAmount: number;

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

  @Column('varchar', { name: 'invoice_id', length: 255, nullable: true })
  invoiceId: string; // Тухайн төлбөрийн баримтын харгалзах нэхэмжлэхийн ДДТД

  @Column('varchar', { name: 'lottery', length: 255, nullable: true })
  lottery: string; // Сугалааны дугаар

  @Column('text', { name: 'qr_data', nullable: true })
  qrData: string; // ebarimt qr code

  @OneToMany(() => Order, (order) => order.payment)
  orders?: Order[];

  @OneToMany(() => PaymentDetail, (dtl) => dtl.payment)
  details?: PaymentDetail[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
