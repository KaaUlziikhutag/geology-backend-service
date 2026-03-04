import { AbstractEntity } from '../../utils/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Order from '../order/order.entity';
import Mineral from '../appointment/mineral/mineral.entity';
import { TaskState } from '../../utils/enum-utils';
import Users from '../users/users.entity';
/** Ажлын даалгавар */
@Entity('tasks')
export default class Task extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  barcode: string; // Баркод

  @Column({ name: 'order_id' })
  orderId: number; // Захиалга
  @JoinColumn({ name: 'order_id' })
  @ManyToOne(() => Order, (order) => order.tasks)
  order?: Order;

  @Column({ name: 'mineral_id' })
  mineralId: number; // Дээж
  @JoinColumn({ name: 'mineral_id' })
  @ManyToOne(() => Mineral, (mineral) => mineral.tasks)
  mineral?: Mineral; // analytic

  @Column({ type: 'enum', enum: TaskState, default: TaskState.Pending })
  state: TaskState; // Төлөв

  @Column({ name: 'is_duplicate', type: 'boolean', default: false })
  isDuplicate: boolean; // Төлөв

  @ManyToMany(() => Users)
  @JoinTable({
    name: 'task_users',
    joinColumn: { name: 'task_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  users?: Users[]; // Хэрэглэгчид
}
