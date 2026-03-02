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
  OneToMany,
  OneToOne,
} from 'typeorm';
import {
  EmployeeType,
  JobAction,
  TemporaryOptions,
  TimeAccessType,
  WorkType,
} from '@utils/enum-utils';
import Human from '../human/human.entity';
import AppointmentByuser from '../../../human-resource/appointment/entities/appointment-byuser.entity';
import HolidayByuser from '../../../human-resource/holiday/entities/holiday-byuser.entity';
import Occupation from '../../../human-resource/tree/cccupation/cccupation.entity';
import InsuranceType from '../../../human-resource/tree/insurance-type/insurance-type.entity';
import Trees from '../../../human-resource/tree/tree.entity';
import EmploymentContract from '../../../contract/option/employment/employment.entity';
import TimeRequestByusers from '../../../time-access/options/agree-byuser/agree-byuser.entity';
import TimeIpAddressByusers from '../../../time-access/options/ip-address/entity/ip-byuser.entity';
import SupervisorByusers from '../../../time-access/options/supervisor/entity/supervisor-byuser.entity';
import ContractViewUser from '../../../contract/view-users/view-users.entity';
import Contract from '../../../contract/contract.entity';
import ContractDelegateOur from '../../../contract/delegate-our/delegate-our.entity';
import Inner from '../../../decision/inner/inner.entity';
import Above from '../../../decision/above/above.entity';
import WorkerApp from './entities/worker-app.entity';
import DecisionViewUser from '../../../decision/view-users/view-users.entity';
import { Comments } from '../../../public/news/entities/comment.entity';
import NewsLike from '../../../shared/like/like.entity';
@Entity('worker_i')
export default class Worker extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'company_id', nullable: true })
  companyId: number;

  @Column({ name: 'human_id', nullable: true })
  humanId: number;
  @OneToOne(() => Human, (human: Human) => human.workers, {
    nullable: true,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'human_id' })
  public humans?: Human;

  @Column({ name: 'author_id', nullable: true })
  authorId: number; // Хариуцагч шилжүүлэх
  @ManyToOne(() => Worker, (worker: Worker) => worker.children)
  @JoinColumn({ name: 'author_id' })
  parent: Worker;

  @Column({ name: 'dep_id', nullable: true })
  depId: number; // tree Id
  @ManyToOne(() => Trees, (tree: Trees) => tree.workerDep)
  @JoinColumn({ name: 'dep_id' })
  depTree?: Trees;

  @Column({ name: 'app_id', nullable: true })
  appId: number; // treeId
  @ManyToOne(() => Trees, (tree: Trees) => tree.worker)
  @JoinColumn({ name: 'app_id' })
  appTree?: Trees;

  @Column({ name: 'confirm_id', nullable: true })
  confirmId: number; // treeId

  @Column('varchar', { name: 'com_name', length: 255, nullable: true })
  comName: string;

  @Column('varchar', { name: 'dep_name', length: 255, nullable: true })
  depName: string; // Хэлтэс нэгж

  @Column('varchar', { name: 'app_name', length: 255, nullable: true })
  appName: string; // Албан тушаал

  @Column('varchar', { name: 'system_name', length: 255, nullable: true })
  systemName: string;

  @Column({ nullable: true })
  position: number;

  @Column({ nullable: true })
  isActive: number;

  @Column({ name: 'date_of_employment', type: 'date', nullable: true })
  dateOfEmployment: Date;

  @Column({
    type: 'enum',
    enum: WorkType,
    nullable: true,
    name: 'worker_type',
  })
  public workerType: WorkType; // Төлөв солих

  @Column({
    type: 'enum',
    enum: JobAction,
    nullable: true,
    name: 'job_action',
  })
  public jobAction: JobAction; // Албан тушаал

  @Column({ name: 'worker_tip', nullable: true })
  workerTip: number;

  @Column({ name: 'occupation_id', nullable: true })
  occupationId: number;
  @ManyToOne(() => Occupation, (occupation: Occupation) => occupation.worker)
  @JoinColumn({ name: 'occupation_id' })
  occupations?: Occupation;

  @Column({ name: 'insurance_id', nullable: true })
  insuranceId: number;
  @ManyToOne(
    () => InsuranceType,
    (insurance: InsuranceType) => insurance.worker,
  )
  @JoinColumn({ name: 'insurance_id' })
  insurances?: InsuranceType;

  @Column({ name: 'is_moderator', default: false })
  isModerator: boolean;

  @Column({ name: 'is_edit_date', default: false })
  isEditDate: boolean;

  @Column({ name: 'is_request', default: false })
  isRequest: boolean;

  @Column({ nullable: true })
  public profileId?: number;

  @Column('varchar', { name: 'work_mail', length: 255, nullable: true })
  workMail: string;

  @Column('varchar', { name: 'work_phone', length: 18, nullable: true })
  workPhone: string;

  @Column('varchar', { length: 12, nullable: true })
  code: string;

  @Column('varchar', { name: 'code_out', length: 255, nullable: true })
  codeOut: string;

  @Column('varchar', { length: 255, nullable: true })
  ergonomist: string;

  @Column({ name: 'time_access_id', nullable: true })
  timeAccessId: number;

  @Column({
    type: 'enum',
    enum: TimeAccessType,
    nullable: true,
    name: 'time_access_type',
  })
  public timeAccessType: TimeAccessType;

  @Column({
    type: 'enum',
    enum: EmployeeType,
    nullable: true,
    name: 'employee_type',
  })
  public employeeType: EmployeeType;

  @Column({
    type: 'enum',
    enum: TemporaryOptions,
    nullable: true,
    default: TemporaryOptions.FullTime,
    name: 'temporary_options',
  })
  public temporaryOptions: TemporaryOptions;

  @Column({ name: 'time_access_mode', nullable: true })
  timeAccessMode: number;

  @Column({ name: 'time_step_id', nullable: true })
  timeStepId: number;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

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

  @OneToMany(() => Worker, (worker: Worker) => worker.parent)
  children: Worker[];

  @OneToMany(() => Comments, (comments: Comments) => comments.workers)
  comments: Comments[];

  @OneToMany(() => NewsLike, (newsLike: NewsLike) => newsLike.workers)
  newsLikes: NewsLike[];

  // @OneToMany(
  //   () => AppointmentByuser,
  //   (appointmentByuser: AppointmentByuser) => appointmentByuser.workers,
  // )
  // appointmentByusers?: AppointmentByuser[];

  // @OneToMany(
  //   () => HolidayByuser,
  //   (holidayByusers: HolidayByuser) => holidayByusers.workers,
  // )
  // holidayByusers?: HolidayByuser[];

  // @OneToMany(
  //   () => EmploymentContract,
  //   (employmentContract: EmploymentContract) => employmentContract.workers,
  // )
  // employmentContract?: EmploymentContract[];

  // @OneToMany(
  //   () => EmploymentContract,
  //   (employmentContract: EmploymentContract) =>
  //     employmentContract.ourConfirmWorker,
  // )
  // employmentContractOur?: EmploymentContract[];

  // @OneToMany(
  //   () => TimeRequestByusers,
  //   (timeRequestByusers: TimeRequestByusers) => timeRequestByusers.workers,
  // )
  // timeRequestByusers?: TimeRequestByusers[];

  // @OneToMany(
  //   () => TimeIpAddressByusers,
  //   (timeIpAddressByusers: TimeIpAddressByusers) =>
  //     timeIpAddressByusers.workers,
  // )
  // timeIpAddressByusers?: TimeIpAddressByusers[];

  // @OneToMany(
  //   () => SupervisorByusers,
  //   (supervisorByusers: SupervisorByusers) => supervisorByusers.workers,
  // )
  // supervisorByusers?: SupervisorByusers[];

  // @OneToMany(() => Contract, (contract: Contract) => contract.ourConfirmWorker)
  // contract?: Contract[];

  // @OneToMany(
  //   () => DecisionViewUser,
  //   (decisionViewUser: DecisionViewUser) => decisionViewUser.workers,
  // )
  // decisionViewUser?: DecisionViewUser[];

  // @OneToMany(() => Inner, (inner: Inner) => inner.confirmInnerWorker)
  // confirmInner?: Inner[];

  // @OneToMany(() => Above, (above: Above) => above.authorAboveWorker)
  // authorAbove?: Above[];

  // @OneToMany(
  //   () => WorkerApp,
  //   (workerApp: WorkerApp) => workerApp.appConfirmWorker,
  // )
  // workerAppConfirm?: WorkerApp[];

  // @OneToMany(() => Above, (above: Above) => above.signAboveWorker)
  // above?: Above[];

  // @OneToMany(
  //   () => ContractDelegateOur,
  //   (contractDelegateOur: ContractDelegateOur) => contractDelegateOur.worker,
  // )
  // contractDelegateOur?: ContractDelegateOur[];

  // @OneToMany(
  //   () => ContractViewUser,
  //   (contractViewUser: ContractViewUser) => contractViewUser.worker,
  //   { onUpdate: 'CASCADE' },
  // )
  // viewUsers?: ContractViewUser[];
}
