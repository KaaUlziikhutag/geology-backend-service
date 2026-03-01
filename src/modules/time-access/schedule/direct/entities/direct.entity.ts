import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import MainSchedules from '../main-schedule/main-schedule.entity';
import DirectLosts from '../../../shared/lost/lost.entity';
import Trees from '../../../../human-resource/tree/tree.entity';
import DirectViewUser from './direct-view-user.entity';
import {
  AppointmentStatusType,
  CalculationType,
} from '../../../../../utils/globalUtils';
import Worker from '../../../../human-resource/member/worker/worker.entity';
import DirectSchedules from '../schedule/schedule.entity';

@Entity('time_access_schedule_direct_i')
export default class Directs extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255, nullable: true })
  name: string; //Цагийн хуваарь

  @Column({ name: 'com_id', nullable: true })
  comId: number; //Company id

  @Column('varchar', { length: 4000, nullable: true })
  note: string; // Тайлбар

  @Column({
    type: 'enum',
    enum: AppointmentStatusType,
    default: AppointmentStatusType.Expected,
    nullable: true,
  })
  public status: AppointmentStatusType;

  @Column('varchar', { name: 'bound_time', length: 255, nullable: true })
  boundTime: string; //Эхлэх цаг

  @Column({ name: 'author_id', nullable: true })
  authorId: number; // нэмсэн хүний id

  @Column({ name: 'user_count', nullable: true })
  userCount: number; //Хамрах хэрэглэгчид

  @Column('int', { array: true, name: 'tree_ids', nullable: true })
  treeIds?: number[]; // Хамаарах алба нэгж

  @ManyToMany(() => Trees)
  @JoinTable({
    name: 'direct_tree_mapping',
    joinColumn: { name: 'direct', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tree_id', referencedColumnName: 'id' },
  })
  trees: Trees[]; // Хамаарах алба нэгж байгууллагын бүтэц

  @Column('int', { array: true, name: 'view_user_ids', nullable: true })
  viewUserIds?: number[]; // Харах эрхтэй хэрэглэгчид

  @OneToMany(
    () => DirectViewUser,
    (viewUser: DirectViewUser) => viewUser.direct,
  )
  public viewUsers: DirectViewUser[]; // Хамаарах хэрэглэгчид

  @Column({ name: 'is_main', default: false })
  isMain: boolean; //Үндсэн цагийн хуваарь эсэх

  @Column({ name: 'is_employees', default: false })
  isEmployees: boolean; // Бүх ажилжид дагаж мөрдөх эсэх

  @Column({ name: 'over_time', nullable: true })
  overTime: number; //Илүү цаг

  @Column('varchar', { length: 30, nullable: true })
  time2: string; // Цайнд гарах цаг

  @Column('varchar', { length: 30, nullable: true })
  time3: string; // Цайнаас ирэх цаг

  @Column({ name: 'day_money', nullable: true })
  dayMoney: number; //Тасалсан өдрийн торгууль

  @Column({ name: 'half_day_money', nullable: true })
  halfDayMoney: number; //Тасалсан хагас өдрийн торгууль

  @Column({ name: 'miss_clock_policy', nullable: true })
  missClockPolicy: number; //0 =>'тооцохгүй', 50=> 'хагасаар', 100=> 'бүтнээр' Бүртгэл дутуу үед ажилласан цагийг хэрхэн тооцох, ажил эхлэх, дуусах цагийн аль нэг нь бүртгэгдээгүй бол

  @Column({ name: 'is_delete', default: false })
  isDelete: boolean; //Хуваарийг устгах эсэх

  @Column({ name: 'is_regular', default: false })
  isRegular: boolean; // Хуваарийг устгах эсэх

  @Column({ name: 'insert_date', type: 'timestamptz', nullable: true })
  insertDate: Date; //Мөрдөх хугацаа

  @Column({ name: 'end_date', type: 'timestamptz', nullable: true })
  endDate: Date; //дуусах хугацаа

  @Column({ name: 'is_morning', default: false })
  isMorning: boolean; // Өглөөний илүү цаг бодох эсэх

  @Column({ name: 'is_delay_time', default: false })
  isDelayTime: boolean; // Цайны цагаас хоцролт тооцох

  @Column({
    type: 'enum',
    name: 'working_hours',
    enum: CalculationType,
    nullable: true,
  })
  public workingHours: CalculationType; // Бүртгэл дутуу өдрийн ажилсан цаг

  @OneToMany(
    () => MainSchedules,
    (mainSchedules: MainSchedules) => mainSchedules.direct,
  )
  mainSchedules?: MainSchedules[];

  @OneToMany(() => DirectLosts, (directLost: DirectLosts) => directLost.direct)
  directLost?: DirectLosts[];

  @Column({ name: 'confirm_Id', nullable: true })
  confirmId: number; // Батлах албан тушаалтан'
  @JoinColumn({ name: 'confirm_Id' })
  @ManyToOne(() => Worker)
  confirmWorker?: Worker;

  @OneToMany(
    () => DirectSchedules,
    (directSchedules: DirectSchedules) => directSchedules.direct,
  )
  public directSchedules: DirectSchedules[]; // Хамаарах хэрэглэгчид

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
