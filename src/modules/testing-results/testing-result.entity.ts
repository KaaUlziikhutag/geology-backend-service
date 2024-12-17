import { AbstractEntity } from '../../utils/abstract.entity.js';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import Task from '../task/task.entity.js';
import Users from '../users/users.entity.js';
import ResultIndicator from './result-indicator.entity.js';

/** Шинжилгээний үр дүн */
@Entity('testing_results')
export default class TestingResult extends AbstractEntity {
  @Column({ name: 'task_id' })
  taskId: number;
  @JoinColumn({ name: 'task_id' })
  @ManyToOne(() => Task)
  task?: Task;

  @Column({ name: 'review_id', nullable: true })
  reviewId: number;
  @JoinColumn({ name: 'review_id' })
  @ManyToOne(() => Users)
  review?: Users;

  @Column({ name: 'confirm_id', nullable: true })
  confirmId: number;
  @JoinColumn({ name: 'confirm_id' })
  @ManyToOne(() => Users)
  confirm?: Users;

  @OneToMany(
    () => ResultIndicator,
    (resultIndicator) => resultIndicator.result,
    { cascade: true },
  )
  resultIndicators: ResultIndicator[];
}
