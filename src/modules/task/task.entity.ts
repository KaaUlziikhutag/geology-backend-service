import { AbstractEntity } from '../../utils/abstract.entity.js';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
import Order from '../order/order.entity.js';
import Mineral from '../appointment/mineral/mineral.entity.js';
import { TaskState } from '../../utils/enum-utils.js';
import Users from '../users/users.entity.js';
import TaskUser from './task-user/task-user.entity.js';
/** Ажлын даалгавар */
@Entity('tasks')
export default class Task extends AbstractEntity {
  @Column({ type: 'varchar', unique: true })
  barcode: string; // Баркод

  @Column({ name: 'order_id' })
  orderId: number; // Захиалга
  @JoinColumn({ name: 'order_id' })
  @ManyToOne(() => Order, (order) => order.tasks)
  order?: Relation<Order>;

  @Column({ name: 'mineral_id' })
  mineralId: number; // Дээж
  @JoinColumn({ name: 'mineral_id' })
  @ManyToOne(() => Mineral, (mineral) => mineral.tasks)
  mineral?: Relation<Mineral>; // analytic

  @Column({ type: 'enum', enum: TaskState, default: TaskState.Pending })
  state: TaskState; // Төлөв

  @Column({ name: 'is_duplicate', type: 'boolean', default: false })
  isDuplicate: boolean; // Төлөв

  @OneToMany(() => TaskUser, (taskUser) => taskUser.task)
  users?: Relation<TaskUser>[];
}
