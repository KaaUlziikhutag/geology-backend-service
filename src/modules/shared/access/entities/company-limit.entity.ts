import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('company_limit_k')
export default class Companies extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'item_id', nullable: true })
  itemId: number;

  @Column('varchar', { length: 100 })
  pro: string;

  @Column({ name: 'com_id', nullable: true })
  comId: number;

  @Column({ name: 'is_allow', default: false })
  isAllow: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
