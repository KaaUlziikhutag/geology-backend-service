import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('shared_user_group_i')
export default class UserGroups extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, name: 'user_id' })
  userId: number;

  @Column('varchar', { length: 255, nullable: true })
  name: string;

  @Column({ name: 'is_share', default: false, nullable: true })
  isShare: boolean;

  @Column('varchar', { length: 255, nullable: true })
  note: string;

  @Column({ nullable: true, name: 'user_count' })
  userCount: number;

  @Column({ nullable: true })
  pos: number;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
