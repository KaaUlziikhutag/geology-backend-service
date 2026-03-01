import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {
  DepartmentType,
  Situation,
  TypeOfPosition,
  TypeStatus,
} from '../../../utils/globalUtils';
import InsuranceType from './insurance-type/insurance-type.entity';
import Worker from '../member/worker/worker.entity';
import Occupation from './cccupation/cccupation.entity';
import WorkerApp from '../member/worker/entities/worker-app.entity';
import EmploymentContract from '../../contract/option/employment/employment.entity';
@Entity('cloud_tree_i')
export default class Trees extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  mid: number; // tree Id
  @ManyToOne(() => Trees, (tree: Trees) => tree.children)
  @JoinColumn({ name: 'mid' })
  parent: Trees;

  @OneToMany(() => Trees, (tree: Trees) => tree.parent)
  children: Trees[];

  @Column({ name: 'autorId', nullable: true })
  autorId: number;

  @Column('varchar', { name: 'autor_mame', length: 255, nullable: true })
  autorName: string;

  @Column({
    type: 'enum',
    enum: TypeStatus,
  })
  public type: TypeStatus;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { name: 'short_name', length: 255, nullable: true })
  shortName: string;

  @Column({ nullable: true })
  pos: number;

  @Column({ name: 'insurance_type_id', nullable: true })
  insuranceTypeId: number;
  @ManyToOne(
    () => InsuranceType,
    (insuranceType: InsuranceType) => insuranceType.trees,
  )
  @JoinColumn({ name: 'insurance_type_id' })
  insuranceTypes?: InsuranceType;

  @Column({ name: 'is_active', nullable: true })
  isActive: number;

  @Column({ name: 'is_device', default: false, nullable: true })
  isDevice: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @Column({ nullable: true })
  preId: number;

  @Column('varchar', { name: 'work_duty', length: 4000, nullable: true })
  workDuty: string; // Үндсэн чиг үүрэг

  @Column({ type: 'int', default: 0, nullable: true })
  position: number;

  @Column({ name: 'total_number', nullable: true })
  totalNumber: number;

  @Column({
    type: 'enum',
    enum: TypeOfPosition,
    nullable: true,
    name: 'type_of_position',
  })
  public typeOfPosition: TypeOfPosition;

  @Column({
    type: 'enum',
    enum: Situation,
    nullable: true,
  })
  public situation: Situation;

  @Column({
    type: 'enum',
    enum: DepartmentType,
    nullable: true,
    name: 'department_type',
  })
  public departmentType: DepartmentType;

  @Column({ type: 'int', default: 0 })
  positionSum?: number;

  @Column({ name: 'occupation_id', nullable: true })
  occupationId: number;
  @ManyToOne(() => Occupation, (occupation: Occupation) => occupation.tree)
  @JoinColumn({ name: 'occupation_id' })
  occupations?: Occupation;

  @OneToMany(() => Worker, (worker: Worker) => worker.appTree)
  worker?: Worker[];

  @OneToMany(() => Worker, (worker: Worker) => worker.depTree)
  workerDep?: Worker[];

  @OneToMany(
    () => EmploymentContract,
    (employmentContract: EmploymentContract) => employmentContract.tree,
  )
  employmentContract?: EmploymentContract[];

  @OneToMany(() => WorkerApp, (workerApp: WorkerApp) => workerApp.appTree)
  workerApp?: WorkerApp[];

  @OneToMany(() => WorkerApp, (workerDep: WorkerApp) => workerDep.depTree)
  workerDeps?: WorkerApp[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
