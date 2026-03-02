import {
  AppointmentCostType,
  AppointmentStatusType,
  CompensationType,
  RequestType,
  TimeEventType,
  WorkTime,
} from '@utils/enum-utils';
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
import TimeState from './time-state/time-state.entity';
import Worker from '../../human-resource/member/worker/worker.entity';
import Appointments from '../../human-resource/appointment/entities/appointment.entity';
import LocalFile from '@modules/local-files/local-file.entity';
@Entity('time_access_time_request_i')
export default class TimeRequest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  public userId: number; //User id хүсэлт гаргасан хэрэглэгч
  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => Worker)
  userWorker?: Worker;

  @Column({ name: 'time_state_id', nullable: true })
  timeStateId: number; // хүсэлтийн төрөл
  @ManyToOne(() => TimeState, (timeState: TimeState) => timeState.timeRequest)
  @JoinColumn({ name: 'time_state_id' })
  public timeState?: TimeState;

  @Column({ name: 'is_full_day', default: false })
  isFullDay: boolean; // Бүтэн өдрөөр авах

  @Column({ name: 'is_lost_time', default: false })
  isLostTime: boolean; // Цагаа нөхөж бүртгүүлж байгаа эсэх

  @Column({ name: 'is_foreign_assignment', default: false })
  isForeignAssignment: boolean; // Цагаа нөхөж бүртгүүлж байгаа эсэх

  @Column({
    type: 'enum',
    enum: TimeEventType,
    name: 'time_selection',
    nullable: true,
  })
  public timeSelection: TimeEventType; // Цагийн сонголт

  @Column({ name: 'appointment_id', nullable: true })
  appointmentId: number; // Томилолтын нэр
  @JoinColumn({ name: 'appointment_id' })
  @ManyToOne(() => Appointments)
  appointment?: Appointments;

  @Column({ name: 'start_date', type: 'timestamptz', nullable: true })
  startDate: Date; // Эхлэх хугацаа

  @Column({ name: 'end_date', type: 'timestamptz', nullable: true })
  endDate: Date; // дуусах огноо

  @Column('varchar', { name: 'start_time', length: 30, nullable: true })
  startTime: string; // Эхлэх минут

  @Column('varchar', { name: 'end_time', length: 30, nullable: true })
  endTime: string; // дуусах минут

  @Column('varchar', { name: 'total_time', length: 255, nullable: true })
  totalTime: string; // Нийт цаг

  @Column({ name: 'total_days', nullable: true })
  totalDays: number; // Нийт хоног

  @Column({
    type: 'enum',
    enum: RequestType,
    nullable: true,
  })
  public type: RequestType; // Төрөл

  @Column({ name: 'work_day', nullable: true })
  workDay: number; // ажлын  хоног

  @Column({ name: 'country_id', nullable: true })
  countryId: number;

  @Column({ name: 'city_id', nullable: true })
  cityId: number;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @Column({ name: 'committee_id', nullable: true })
  committeeId: number;

  @Column('varchar', { length: 4000, nullable: true })
  money: string; // Томилолтийн мөнгө

  @Column('varchar', { name: 'address_details', length: 4000, nullable: true })
  addressDetails: string; // хаягийн дэлгэрэнгүй

  @Column({
    type: 'enum',
    enum: AppointmentCostType,
    nullable: true,
  })
  public cost: AppointmentCostType; // санжүүжилт төрөл

  @Column({
    type: 'enum',
    enum: WorkTime,
    name: 'work_time',
    nullable: true,
  })
  public workTime: WorkTime; // илүү цагийн төрөл

  @Column({
    type: 'enum',
    enum: CompensationType,
    name: 'compensation_type',
    nullable: true,
  })
  public compensationType: CompensationType; // Илүү цагийг хэрэгжүүлэх хэлбэр

  @Column('varchar', { name: 'remainingTime', length: 30, nullable: true })
  remainingTime: string; // Үлдсэн фонд цаг

  @Column('varchar', { name: 'transfer_to_salary', length: 30, nullable: true })
  transferToSalary: string; // Цалинд шилжүүлэх цаг

  @Column({ name: 'is_salary', default: false })
  isSalary: boolean; // Биеэр эдлэхгүй цалин руу шилжүүлэх эсэх

  @Column({
    type: 'enum',
    enum: AppointmentStatusType,
    default: AppointmentStatusType.Expected,
    nullable: true,
  })
  public status: AppointmentStatusType;

  @Column('varchar', { length: 4000, nullable: true })
  description: string; // шалтгаан тайлбар

  @Column('varchar', { length: 4000, nullable: true })
  purpose: string; // Зорилго

  @Column({ name: 'com_id', nullable: true })
  comId: number; //Company id

  @Column({ name: 'confirm_Id', nullable: true })
  confirmId: number; // Батлах албан тушаалтан'
  @JoinColumn({ name: 'confirm_Id' })
  @ManyToOne(() => Worker)
  confirmWorker?: Worker;

  @Column({ type: 'jsonb', name: 'fileIds', nullable: true })
  fileIds: LocalFile[]; // FILE UPLOAD

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

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt: Date;
}
