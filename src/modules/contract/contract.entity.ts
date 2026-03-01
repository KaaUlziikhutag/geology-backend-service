import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  Relation,
} from 'typeorm';
import { AbstractEntity } from '../../utils/abstract.entity';
import Customer from '../customer/customer.entity';
import Product from '../product/product.entity';
import LocalFile from '../local-files/local-file.entity';
import Discount from '../reference/discount/discount.entity';
/** Үйлчлүүлэгчтэй байгуулах гэрээ */
@Entity('contracts')
export default class Contract extends AbstractEntity {
  @Column({ name: 'current_at', type: 'date' })
  currentAt: Date; // гэрээ байгуулсан огноо

  @Column({ name: 'end_at', type: 'date' })
  endAt: Date; // гэрээ дуусах огноо

  @Column({ name: 'customer_id' })
  customerId: number;
  @JoinColumn({ name: 'customer_id' })
  @ManyToOne(() => Customer)
  customer?: Relation<Customer>;

  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
  amount: number;

  @Column({ name: 'attachment_id', nullable: true })
  attachmentId: number;
  @JoinColumn({ name: 'attachment_id' })
  @ManyToOne(() => LocalFile)
  attachment?: LocalFile;

  @JoinTable({
    name: 'contract_products',
    joinColumn: { name: 'contract_id' },
    inverseJoinColumn: { name: 'product_id' },
  })
  @ManyToMany(() => Product)
  products?: Product[];

  @JoinTable({
    name: 'contract_discounts',
    joinColumn: { name: 'contract_id' },
    inverseJoinColumn: { name: 'discount_id' },
  })
  @ManyToMany(() => Discount)
  discounts?: Discount[];
}
