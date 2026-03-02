import { AppointmentStatusType, CalculationType } from '@utils/enum-utils';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import RepeatDetails from '../detail/entities/repeat-detail.entity';
import Worker from '../../../../human-resource/member/worker/worker.entity';
import RepeatSchedules from '../schedule/schedule.entity';
@Entity('time_access_repeat_i')
export default class Repeats extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 4000, nullable: true })
  name: string; // Хуваарийн нэр

  @Column('varchar', { length: 4000, nullable: true })
  description: string; // Нэмэлт тайлбар

  @Column('varchar', { name: 'start_night', length: 30, nullable: true })
  startNight: string; // Шөнийн цаг

  @Column('varchar', { name: 'end_night', length: 30, nullable: true })
  endNight: string; //  Шөнийн цаг

  @Column('varchar', { length: 400, nullable: true })
  color: string; //  Шөнийн цаг

  @Column({ name: 'start_date', type: 'timestamp', nullable: true })
  startDate: Date; // эхлэх огноо

  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate: Date; // дуусах огноо

  @Column({ name: 'day_money', nullable: true })
  dayMoney: number; // Тасалсан өдрийн торгууль

  @Column({ name: 'confirm_id', nullable: true })
  confirmId: number;
  @JoinColumn({ name: 'confirm_Id' })
  @ManyToOne(() => Worker)
  confirmWorker?: Worker;

  @Column({ name: 'half_day_money', nullable: true })
  halfDayMoney: number; // Тасалсан хагас өдрийн торгууль

  @Column({
    type: 'enum',
    name: 'working_hours',
    enum: CalculationType,
    nullable: true,
  })
  public workingHours: CalculationType; // Бүртгэл дутуу өдрийн ажилсан цаг

  @Column({
    type: 'enum',
    enum: AppointmentStatusType,
    default: AppointmentStatusType.Expected,
    nullable: true,
  })
  public status: AppointmentStatusType;

  @Column({ name: 'is_morning', default: false })
  isMorning: boolean; // Өглөөний илүү цаг бодох эсэх

  @Column({ name: 'is_delay_time', default: false })
  isDelayTime: boolean; // Цайны цагаас хоцролт тооцох

  @Column({ name: 'autor_id', nullable: true }) //Author id
  autorId: number;

  @Column({ name: 'com_id', nullable: true }) //Author id
  comId: number;

  @OneToMany(
    () => RepeatDetails,
    (repeatDetails: RepeatDetails) => repeatDetails.repeats,
  )
  public repeatDetails: RepeatDetails[]; // Хамаарах хэрэглэгчид

  @OneToMany(
    () => RepeatSchedules,
    (repeatSchedules: RepeatSchedules) => repeatSchedules.repeats,
  )
  public repeatSchedules: RepeatSchedules[]; // Хамаарах хэрэглэгчид

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt: Date;
}
