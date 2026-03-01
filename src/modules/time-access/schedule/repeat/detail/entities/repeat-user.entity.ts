import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Worker from '../../../../../human-resource/member/worker/worker.entity';
import RepeatDetails from './repeat-detail.entity';
@Entity('repeat_detail_byuser_k')
// Ээлжинд хамаарах хэрэглэгчид
export default class RepeatDetailViewUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'repeat_detail_Id', nullable: true }) // Гэрээний id
  public repeatDetailId: number;
  @ManyToOne(
    () => RepeatDetails,
    (directdDetail: RepeatDetails) => directdDetail.viewUsers,
  )
  @JoinColumn({ name: 'repeat_detail_Id' })
  public directdDetail: RepeatDetails;

  @Column({ name: 'user_id' }) //Хэрэглэгчийн id
  public userId: number;
  @ManyToOne(() => Worker, (worker: Worker) => worker.viewUsers)
  @JoinColumn({ name: 'user_id' })
  public worker?: Worker;
}
