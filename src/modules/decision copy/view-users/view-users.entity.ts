import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Inner from '../inner/inner.entity';
import Above from '../above/above.entity';
import Worker from '../../human-resource/member/worker/worker.entity';

@Entity('decision_view_users')
export default class DecisionViewUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'above_id', nullable: true }) //Above id
  public aboveId: number;
  @ManyToOne(() => Above, (above: Above) => above.viewUsers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'above_id' })
  public above: Above;

  @Column({ name: 'inner_id', nullable: true }) //Inner id
  public innerId: number;
  @ManyToOne(() => Inner, (inner: Inner) => inner.viewUsers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'inner_id' })
  public inner: Inner;

  @Column({ name: 'user_id' }) //Хэрэглэгчийн id
  public userId: number;
  @ManyToOne(() => Worker, (worker: Worker) => worker.decisionViewUser)
  @JoinColumn({ name: 'user_id' })
  public workers?: Worker;
}
