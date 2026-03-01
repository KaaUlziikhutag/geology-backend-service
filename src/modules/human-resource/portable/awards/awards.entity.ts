import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_human_more_awards_i')
export default class Awards extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'author_id', nullable: true })
  authorId: number;

  @Column('varchar', { name: 'award_name', length: 255, nullable: true })
  awardName: string;

  @Column('varchar', { name: 's_name', length: 4000, nullable: true })
  sName: string;

  @Column('varchar', { length: 200, nullable: true })
  bonus: string;

  @Column('varchar', { length: 255, nullable: true })
  reason: string;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
