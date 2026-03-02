import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { AppointmentStatusType, JobAction } from '@utils/enum-utils';
import Trees from '../../../../human-resource/tree/tree.entity';
import Worker from '../worker.entity';

@Entity('worker_app_i')
export default class WorkerApp extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'company_id', nullable: true })
  companyId: number;

  @Column({ name: 'dep_id', nullable: true })
  depId: number; // tree Id
  @ManyToOne(() => Trees, (tree: Trees) => tree.workerDep)
  @JoinColumn({ name: 'dep_id' })
  depTree?: Trees;

  @Column({ name: 'app_id', nullable: true })
  appId: number; // treeId
  @ManyToOne(() => Trees, (tree: Trees) => tree.workerDeps)
  @JoinColumn({ name: 'app_id' })
  appTree?: Trees;

  @Column({ name: 'confirm_id', nullable: true })
  confirmId: number;
  // @ManyToOne(() => Worker, (worker: Worker) => worker.workerAppConfirm)
  // @JoinColumn({ name: 'confirm_id' })
  // public appConfirmWorker?: Worker;

  @Column({
    type: 'enum',
    enum: JobAction,
    nullable: true,
    name: 'job_action',
  })
  public jobAction: JobAction; // Албан тушаал

  @Column({
    type: 'enum',
    enum: AppointmentStatusType,
    nullable: true,
    name: 'worker_type',
  })
  public workerType: AppointmentStatusType; // Төлөв солих

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt: Date;
}
