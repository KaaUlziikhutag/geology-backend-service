import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_member_worker_shift_i')
export default class WorkerShifts extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'worker_id', nullable: true })
  workerId: number;

  @Column({ name: 'autor_id', nullable: true })
  autorId: number;

  @Column({ name: 'com_id', nullable: true })
  comId: number;

  @Column({ name: 'dep_id', nullable: true })
  depId: number;

  @Column({ name: 'app_id', nullable: true })
  appId: number;

  @Column('varchar', { name: 'com_name', length: 255, nullable: true })
  comName: string;

  @Column('varchar', { name: 'dep_name', length: 255, nullable: true })
  depName: string;

  @Column('varchar', { name: 'app_name', length: 255, nullable: true })
  appName: string;

  @Column({ name: 'agree_id', nullable: true })
  agreeId: number;

  @Column('varchar', { length: 255, nullable: true })
  reason: string;

  @Column('varchar', { length: 255, nullable: true })
  number: string;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
