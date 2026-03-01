import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_member_author_shift_byuser_k')
export default class AuthorShiftByuser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'shift_id', nullable: true })
  shift_id: number;

  @Column({ name: 'user_id', nullable: true })
  user_id: number;

  @Column({ name: 'autor_id', nullable: true })
  autorId: number;

  @Column('varchar', { length: 255, nullable: true })
  mode: string;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
