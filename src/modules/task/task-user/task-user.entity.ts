import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import Users from '../../users/users.entity';
import Task from '../task.entity';
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

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => Users)
  user?: Users; // Хэрэглэгч
}
