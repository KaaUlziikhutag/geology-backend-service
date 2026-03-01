import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('shared_field_byuser_k')
export default class Fields extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'worker_id', nullable: true })
  workerId: number; // program_I id

  @Column('varchar', { length: 300, nullable: true })
  program: string;

  @Column('varchar', { length: 300, nullable: true })
  module: string;

  @Column('varchar', { length: 300, nullable: true })
  field: string;

  @Column('varchar', { length: 30, nullable: true })
  name: string;

  @Column('varchar', { length: 100, nullable: true })
  title: string;

  @Column('varchar', { length: 100, nullable: true })
  type: string;

  @Column({ name: 'is_show', default: false })
  isShow: boolean;

  @Column({ nullable: true })
  pos: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
