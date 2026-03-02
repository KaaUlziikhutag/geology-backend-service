import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Worker from '../../../human-resource/member/worker/worker.entity';

@Entity('time_access_options_agree_byuser_k')
export default class AgreeByusers extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;
  // @ManyToOne(() => Worker, (workers: Worker) => workers.timeRequestByusers)
  // @JoinColumn({ name: 'user_id' })
  // workers?: Worker;

  @Column({ name: 'com_id', nullable: true }) //Company id
  comId: number;

  @Column({ name: 'autor_id', nullable: true }) //Author id
  autorId: number;

  @Column({ type: 'date', nullable: true })
  date: Date; //Нэмсэн огноо

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
