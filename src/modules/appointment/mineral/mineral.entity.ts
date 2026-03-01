import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import Appointment from '../appointment.entity';
import MineralType from '../../reference/mineral-type/mineral-type.entity';
import { MineralState } from '../../../utils/enum-utils';
import Task from '../../task/task.entity';
/** Дээж */
@Entity('appointment_minerals')
export default class Mineral extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'appointment_id', nullable: true })
  appointmentId: number; // Захиалга
  @JoinColumn({ name: 'appointment_id' })
  @ManyToOne(() => Appointment, (appointment) => appointment.minerals)
  appointment?: Relation<Appointment>;

  @Column('varchar', { length: 255 })
  name: string; // Нэр

  @Column({ name: 'mineral_type_id' })
  mineralTypeId: number; // Дээжийн төрөл
  @JoinColumn({ name: 'mineral_type_id' })
  @ManyToOne(() => MineralType)
  mineralType?: MineralType;

  @Column({ type: 'float', default: 0 })
  weight: number; // Жин

  @Column({ type: 'enum', enum: MineralState, default: MineralState.pending })
  state: MineralState; // Төлөв

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

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt: Date;

  @OneToMany(() => Task, (task) => task.mineral)
  tasks: Task[];
}
