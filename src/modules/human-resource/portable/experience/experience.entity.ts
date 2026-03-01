import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_human_experience_i')
export default class Experiences extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'author_id', nullable: true })
  authorId: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column('varchar', { name: 'work_type', length: 300, nullable: true })
  workType: string;

  @Column('varchar', { length: 300, nullable: true })
  company: string;

  @Column('varchar', { length: 300, nullable: true })
  branch: string;

  @Column('varchar', { length: 300, nullable: true })
  career: string;

  @Column('varchar', { length: 300, nullable: true })
  department: string;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @Column('varchar', { length: 300, nullable: true })
  reason: string;

  @Column({ name: 'is_applicant', default: false, nullable: true })
  isApplicant: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
