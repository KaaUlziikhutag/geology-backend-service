import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_worker_more_ethics_i')
export default class Ethics extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'author_id', nullable: true })
  authorId: number;

  @Column({ name: 'worker_id', nullable: true })
  workerId: number;

  @Column({ name: 'mis_date', type: 'timestamptz', nullable: true })
  misDate: Date;

  @Column('varchar', { length: 50, nullable: true })
  number: string;

  @Column('varchar', { length: 100, nullable: true })
  mistake: string;

  @Column('varchar', { length: 500, nullable: true })
  description: string;

  @Column({ default: false })
  type: boolean;

  @Column({ name: 'date', type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
