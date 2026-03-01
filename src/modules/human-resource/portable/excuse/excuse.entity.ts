import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_worker_excuse_i')
export default class Excuses extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'author_id', nullable: true })
  authorId: number;

  @Column({ name: 'item_id', nullable: true })
  itemId: number;

  @Column({ name: 'com_id', nullable: true })
  comId: number;

  @Column({ name: 'shift_id', nullable: true })
  shiftId: number;

  @Column('varchar', { length: 300, nullable: true })
  note: string;

  @Column({ name: 'date', type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
