import Contract from '../../contract/contract.entity.js';
import { SpendType } from '../../../utils/enum-utils.js';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
/** Байгууллагын хөнгөлөлт */
@Entity('discounts')
export default class Discount extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  name: string;

  @Column({ type: 'enum', enum: SpendType, default: SpendType.percentage })
  type: SpendType;

  @Column({ type: 'float', default: 0 })
  percentage: number;

  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
  amount: number;
}
