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
import Directs from '../entities/direct.entity';
import { ScheduleStatus } from '../../../../../utils/globalUtils';
@Entity('time_access_schedule_direct_schedule_i')
export default class DirectSchedules extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'direct_id', nullable: true })
  directId: number; //Direct id
  @ManyToOne(() => Directs, (direct: Directs) => direct.directSchedules)
  @JoinColumn({ name: 'direct_id' })
  public direct: Directs;

  @Column({ name: 'autor_id', nullable: true })
  autorId: number; //author id

  @Column({ name: 'user_id', nullable: true })
  userId: number; //author id
  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => Worker)
  worker?: Worker;

  @Column({ name: 'date', type: 'date', nullable: true })
  date: Date;

  @Column({ nullable: true })
  day: number; //author id

  @Column('varchar', { length: 30, nullable: true })
  time1: string; // Ажилдаа ирсэн цаг

  @Column('varchar', { length: 30, nullable: true })
  time2: string; // Ажиллаас тарсан цаг

  @Column('varchar', { length: 30, nullable: true })
  time3: string; //Цайнаас ирэх цаг

  @Column('varchar', { length: 30, nullable: true })
  time4: string; //Цайнаас тарах цаг

  @Column('varchar', { name: 'start_time', length: 30, nullable: true })
  startTime: string; // Ажилдаа ирэх цаг

  @Column('varchar', { name: 'end_time', length: 30, nullable: true })
  endTime: string; // Ажилдаа тарах цаг

  @Column('varchar', { name: 'over_time_1', length: 30, nullable: true })
  overTime1: string; //  Ажлын цагаас өмнө ирсэн

  @Column('varchar', { name: 'over_time_2', length: 30, nullable: true })
  overTime2: string; // Ажлын цагаас хойш ажилласан

  @Column('varchar', { name: 'lost_time_1', length: 30, nullable: true })
  lostTime1: string; // Ажилдаа хоцорсон

  @Column('varchar', { name: 'lost_time_2', length: 30, nullable: true })
  lostTime2: string; // Ажлын цагаа дуусахаас өмнө явсан

  @Column({ default: false })
  isAbsent: boolean;
  // Ажил тасалсан эсэхийг илэрхийлнэ. Хэрвээ ажилтны ирсэн болон явсан цаг бүртгэгдээгүй бол `true` болно.

  @Column({ name: 'is_restday', default: false, nullable: true })
  isRestday: boolean; //Ажлын өдөр - 0  Амралтын өдөр- 1 Баяр ёслолын өдөр -2

  @Column({ name: 'is_holiday', default: false, nullable: true })
  isHoliday: boolean; //Амралтын өдөр эсэх

  @Column({ name: 'is_work', default: false, nullable: true })
  isWork: boolean; // Ажлын өдөр эсэх

  @Column({
    type: 'enum',
    enum: ScheduleStatus,
    nullable: true,
    name: 'schedule_status',
  })
  public scheduleStatus: ScheduleStatus; // Төрөл төлөв

  @Column('varchar', { length: 200, nullable: true })
  note: string; //Тайлбар

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
