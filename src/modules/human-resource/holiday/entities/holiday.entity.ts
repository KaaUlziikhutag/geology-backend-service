import {
  AppointmentStatusType,
  HolidayState,
  WorkType,
} from '@utils/enum-utils';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import HolidayByuser from './holiday-byuser.entity';
@Entity('human_resource_holiday_i')
export default class Holiday extends BaseEntity {
  // Ээлжийн амралт жирэмсэн
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'group_id', nullable: true })
  groupId: number;

  @Column({ name: 'author_id', nullable: true })
  authorId: number;

  @Column('varchar', { length: 250, nullable: true })
  authorName: string; //

  @Column({ name: 'com_id', nullable: true })
  comId: number;

  @Column({ name: 'tree_id', nullable: true })
  treeId: number;

  @Column({
    type: 'enum',
    enum: HolidayState,
    nullable: true,
  })
  public state: HolidayState;

  @Column({
    type: 'enum',
    enum: AppointmentStatusType,
    default: AppointmentStatusType.Expected,
    nullable: true,
  })
  public holidayType: AppointmentStatusType;

  @Column({ name: 'country_id', nullable: true })
  countryId: number;

  @Column({ name: 'city_id', nullable: true })
  cityId: number;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @Column({ name: 'vac_id', nullable: true })
  vacId: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column('varchar', { name: 'user_code', length: 200, nullable: true })
  userCode: string;

  @Column('varchar', { name: 'user_name', length: 200, nullable: true })
  userName: string;

  @Column('varchar', { length: 500, nullable: true })
  comment: string;

  @Column('int', { array: true, nullable: true })
  workerIds?: number[];

  @Column('jsonb', { nullable: true, name: 'country_data' })
  public countries: Record<string, any>;

  @Column({ nullable: true })
  duration: number;

  @Column('varchar', { length: 250, nullable: true })
  note: string; // Тайлбар

  @Column({ name: 'work_day', nullable: true })
  workDay: number;

  @Column({
    type: 'enum',
    enum: WorkType,
    nullable: true,
    name: 'worker_type',
  })
  public workerType: WorkType; // Төлөв солих

  @Column({ name: 'confirm_date', type: 'timestamptz', nullable: true })
  confirmDate: Date;

  @Column({ name: 'confirm_id', nullable: true })
  confirmId: number;

  @Column({ name: 'start_day', type: 'timestamptz', nullable: true })
  startDay: Date;

  @Column({ name: 'end_day', type: 'timestamptz', nullable: true })
  endDay: Date;

  @Column({ name: 'is_multi', default: false, nullable: true })
  isMulti: boolean;

  @Column('varchar', { name: 'close_note', length: 800, nullable: true })
  closeNote: string;

  @Column({ name: 'holder_id', nullable: true })
  holderId: number;

  @Column('varchar', { name: 'holder_user_name', length: 255, nullable: true })
  holderUserName: string;

  @Column('varchar', { name: 'holder_app_name', length: 255, nullable: true })
  holderAppName: string;

  @Column({ name: 'holder_read', default: false, nullable: true })
  holderRead: boolean;

  @Column({ name: 'close_date', type: 'timestamptz', nullable: true })
  closeDate: Date;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @Column({ name: 'date_time', type: 'timestamptz', nullable: true })
  dateTime: Date;

  @OneToMany(
    () => HolidayByuser,
    (holidayByusers: HolidayByuser) => holidayByusers.holidays,
  )
  holidayByusers?: HolidayByuser[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt: Date;
}
