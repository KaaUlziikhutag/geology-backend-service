import {
  AppointmentCostType,
  AppointmentStatusType,
  AppointmentType,
  MoneyType,
  WorkType,
} from '../../../../utils/globalUtils';
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
import AppointmentByuser from './appointment-byuser.entity';
@Entity('human_resource_appointment_i')
export default class Appointments extends BaseEntity {
  // Томилолт
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 250, nullable: true })
  name: string; // томилолтын нэр

  @Column('varchar', { length: 250, nullable: true })
  note: string; // томилолтын нэр

  @Column({
    type: 'enum',
    enum: AppointmentType,
    nullable: true,
  })
  public type: AppointmentType;

  @Column({ type: 'text', nullable: true })
  lecture: string;

  @Column({
    type: 'enum',
    enum: WorkType,
    nullable: true,
    name: 'worker_type',
  })
  public workerType: WorkType; // Төлөв солих

  @Column({
    type: 'enum',
    enum: AppointmentCostType,
    nullable: true,
  })
  public cost: AppointmentCostType;

  @Column({
    type: 'enum',
    enum: AppointmentStatusType,
    default: AppointmentStatusType.Expected,
    nullable: true,
  })
  public status: AppointmentStatusType;

  @Column({ name: 'com_id', nullable: true })
  comId: number;

  @Column({ name: 'autor_id', nullable: true })
  authorId: number;

  @Column('varchar', { length: 250, nullable: true })
  authorName: string; //

  @Column({ nullable: true })
  receiverId: number; // Шилжүүлсэн

  @Column({ nullable: true })
  depId: number; // tree id number

  @Column('varchar', { name: 'command_number', length: 800, nullable: true })
  commandNumber: string;

  @Column({ name: 'start_date', type: 'timestamptz', nullable: true })
  startDate: Date; // Ээлжийн амралтын эхлэх хугцаа

  @Column({ name: 'end_date', type: 'timestamptz', nullable: true })
  endDate: Date; // Ээлжийн амралтын дуусах хугцаа

  @Column({ nullable: true })
  duration: number; // Хэд хоног

  @Column('varchar', { length: 250, nullable: true })
  point: string;

  @Column({ nullable: true })
  expense: number; // нийт үнийн дүн

  @Column('jsonb', { nullable: true, name: 'office_data' })
  public expenses: Record<string, any>;

  @Column('jsonb', { nullable: true, name: 'country_data' })
  public countries: Record<string, any>;

  @Column({
    type: 'enum',
    enum: MoneyType,
    nullable: true,
  })
  public moneyType: MoneyType;

  @Column({ nullable: true })
  employee: number;

  @Column('int', { array: true, nullable: true })
  workerIds?: number[];

  @Column({ name: 'country_id', nullable: true })
  countryId: number;

  @Column({ name: 'city_id', nullable: true })
  cityId: number;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @Column({ name: 'committee_id', nullable: true })
  committeeId: number;

  @Column({ name: 'holder_id', nullable: true })
  holderId: number; // баталсан хэрэглэгч id

  @Column('varchar', { name: 'holder_user_name', length: 255, nullable: true })
  holderUserName: string; //баталсан

  @Column('varchar', { name: 'holder_app_name', length: 255, nullable: true })
  holderAppName: string; // баталсан албан тушаал

  @Column('varchar', { name: 'come_land', length: 255, nullable: true })
  comeLand: string; // улс юмуу хот хаашаа явах

  @Column({ name: 'close_date', type: 'timestamptz', nullable: true })
  closeDate: Date;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @OneToMany(
    () => AppointmentByuser,
    (appointmentByuser: AppointmentByuser) => appointmentByuser.appointments,
  )
  appointmentByusers?: AppointmentByuser[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
