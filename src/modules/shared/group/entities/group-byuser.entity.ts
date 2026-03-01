import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('shared_group_byuser_k')
export default class GroupByusers extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, name: 'group_id' })
  groupId: number;

  @Column({ nullable: true, name: 'user_id' })
  userId: number;

  @Column('varchar', { length: 255, nullable: true })
  pro: string;

  @Column('varchar', { length: 255, nullable: true })
  mod: string;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
