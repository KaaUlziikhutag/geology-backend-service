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
import Appointments from './appointment.entity';
import Worker from '../../../human-resource/member/worker/worker.entity';
@Entity('human_resource_appointment_byuser_k')
export default class AppointmentByuser extends BaseEntity {
  // олон хэрэглэгчийн иэдээлэл нэмэх
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'item_id', nullable: true })
  itemId: number; // appointment_i Id
  @ManyToOne(
    () => Appointments,
    (appointments: Appointments) => appointments.appointmentByusers,
  )
  @JoinColumn({ name: 'item_id' })
  appointments?: Appointments;

  @Column({ name: 'user_id', nullable: true })
  userId: number;
  // @ManyToOne(() => Worker, (workers: Worker) => workers.appointmentByusers)
  // @JoinColumn({ name: 'user_id' })
  // workers?: Worker;

  @Column({ nullable: true })
  mid: number;

  @Column('varchar', { length: 250, nullable: true })
  state: string; //

  @Column({ name: 'is_new', default: false, nullable: true })
  isNew: boolean; // харсан хараагүй

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
