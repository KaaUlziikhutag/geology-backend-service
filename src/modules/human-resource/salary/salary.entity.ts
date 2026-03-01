import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_salary_i')
export default class Salary extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'autor_id', nullable: true })
  autorId: number;

  @Column({ name: 'com_id', nullable: true })
  comId: number;

  @Column({ name: 'salary_year', nullable: true })
  salaryYear: number;

  @Column({ name: 'salary_month', nullable: true })
  salaryMonth: number;

  @Column({ nullable: true })
  mode: number;

  @Column('varchar', { name: 'file_name', length: 800, nullable: true })
  fileName: string;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
