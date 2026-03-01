import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_human_delay_human_i')
export default class DelayHumans extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'item_id', nullable: true })
  itemId: number;

  @Column({ name: 'com_id', nullable: true })
  comId: number;

  @Column({ name: 'receiver_id', nullable: true })
  receiverId: number;

  @Column({ name: 'sender_id', nullable: true })
  senderId: number;

  @Column({ name: 'author_id', nullable: true })
  authorId: number;

  @Column('varchar', { length: 300, nullable: true })
  rule: string;

  @Column({ name: 'is_start', default: false })
  isStart: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @Column({ name: 'start_date', type: 'timestamptz', nullable: true })
  shiftDate: Date;

  @Column({ name: 'confirm_id', nullable: true })
  confirmId: number;

  @Column({ name: 'confirm_date', type: 'timestamptz', nullable: true })
  confirmDate: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
