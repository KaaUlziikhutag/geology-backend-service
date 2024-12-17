import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import Users from '../../users/users.entity.js';
import Task from '../task.entity.js';
/** Ажлын даалгавар */
@Entity('task_users')
export default class TaskUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'task_id' })
  taskId: number; // Захиалга
  @JoinColumn({ name: 'task_id' })
  @ManyToOne(() => Task, (task) => task.users)
  task?: Relation<Task>;

  @Column({ name: 'user_id' })
  userId: number; // Хэрэглэгч

  @Column({ type: 'jsonb' })
  user?: Users; // Хэрэглэгч
}
