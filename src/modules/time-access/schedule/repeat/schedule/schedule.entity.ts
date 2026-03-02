import Worker from '../../../../human-resource/member/worker/worker.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import Repeats from '../entities/repeat.entity';
import { ScheduleStatus } from '@utils/enum-utils';
import Users from '../../../../cloud/user/user.entity';
@Entity('time_access_repeat_schedule_i')
export default class RepeatSchedules extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'time_access_type', length: 30, nullable: true })
  timeAccessType: string; // Цаг бүртгэлийн төрөл систем төхөөрөмж app -аар

  @Column('varchar', { name: 'time_access_id', length: 30, nullable: true })
  timeAccessId: string; //Цаг бүртгэлийн id

  @Column({ name: 'user_id', nullable: true })
  userId: number; // хэрэглэгчийн id
  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => Worker)
  worker?: Worker;

  @Column({ name: 'repeat_id', nullable: true })
  repeatId: number; //Ээлжийн цагийн хуваарь
  @ManyToOne(() => Repeats, (repeat: Repeats) => repeat.repeatSchedules)
  @JoinColumn({ name: 'repeat_id' })
  public repeats: Repeats;

  @Column({ name: 'graphic_id', nullable: true })
  graphicId: number;

  @Column({ name: 'detail_id', nullable: true })
  detailId: number; //Ээлжийн цагийн хуваарь ээлж

  @Column({ name: 'start_date', type: 'timestamptz', nullable: true })
  startDate: Date; // Эхлэх

  @Column({ name: 'end_date', type: 'timestamptz', nullable: true })
  endDate: Date; // Дуусах огноо

  @Column({ nullable: true })
  date2: number; //Нэмэгдсэн огноо

  @Column('varchar', { length: 30, nullable: true })
  time1: string; // Ажилдаа ирсэн цаг

  @Column('varchar', { length: 30, nullable: true })
  time2: string; // Ажиллаас тарсан цаг

  @Column('varchar', { length: 30, nullable: true })
  time3: string; //Цайнаас ирэх цаг

  @Column('varchar', { length: 30, nullable: true })
  time4: string; //Ажилдаа тарах цаг

  @Column('varchar', { name: 'start_time', length: 30, nullable: true })
  startTime: string; // Ажилдаа ирэх цаг

  @Column('varchar', { name: 'end_time', length: 30, nullable: true })
  endTime: string; // Ажилдаа тарах цаг

  @Column('varchar', { length: 30, nullable: true })
  overTime1: string;

  @Column('varchar', { length: 30, nullable: true })
  overTime2: string;

  @Column('varchar', { length: 30, nullable: true })
  lostTime1: string;

  @Column('varchar', { length: 30, nullable: true })
  lostTime2: string;

  @Column({ name: 'is_switch', default: false, nullable: true })
  isSwitch: boolean; //Ажлын өдөр - 0  Амралтын өдөр- 1 Баяр ёслолын өдөр -2

  @Column({ name: 'is_work', default: false, nullable: true })
  isWork: boolean; //Амралтын өдөр эсэх

  @Column({ name: 'author_id', nullable: true })
  authorId: number; //Direct id

  @Column({
    type: 'enum',
    enum: ScheduleStatus,
    nullable: true,
    name: 'schedule_status',
  })
  public scheduleStatus: ScheduleStatus; // Төрөл төлөв

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  user?: Users;
}
