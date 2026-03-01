import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_worker_delay_group_i')
export default class DelayGroups extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'item_id', nullable: true })
  itemId: number;

  @Column({ nullable: true })
  note: number;

  @Column({ name: 'decision_num', nullable: true })
  decisionNum: number;

  @Column({ name: 'start_date', type: 'timestamptz', nullable: true })
  fdate: Date;

  @Column({ name: 'end_date', type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
