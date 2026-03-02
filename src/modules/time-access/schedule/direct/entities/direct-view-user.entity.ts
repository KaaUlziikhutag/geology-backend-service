import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Worker from '../../../../human-resource/member/worker/worker.entity';
import Directs from './direct.entity';

@Entity('time_access_schedule_direct_view_users')
export default class DirectViewUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'direct_id', nullable: true }) // Шугаман хуваарийн id
  public directId: number;
  @ManyToOne(() => Directs, (direct: Directs) => direct.viewUsers)
  @JoinColumn({ name: 'direct_id' })
  public direct: Directs;

  @Column({ name: 'user_id' }) //Хэрэглэгчийн id
  public userId: number;
  // @ManyToOne(() => Worker, (worker: Worker) => worker.viewUsers)
  // @JoinColumn({ name: 'user_id' })
  // public worker?: Worker;
}
