import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Worker from '../../../../human-resource/member/worker/worker.entity';
import Supervisor from './supervisor.entity';

@Entity('time_access_options_supervisor_byuser_k')
export default class SupervisorByusers extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'supervisor_id', nullable: true })
  supervisorId: number;
  @ManyToOne(
    () => Supervisor,
    (supervisor: Supervisor) => supervisor.supervisorByusers,
  )
  @JoinColumn({ name: 'supervisor_id' })
  supervisors?: Supervisor;

  @Column({ name: 'user_id', nullable: true })
  userId: number;
  @ManyToOne(() => Worker, (workers: Worker) => workers.supervisorByusers)
  @JoinColumn({ name: 'user_id' })
  workers?: Worker;

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
}
