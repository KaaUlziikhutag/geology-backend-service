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
  OneToMany,
  JoinTable,
  ManyToMany,
} from 'typeorm';

import Type from '../../option/type/type.entity';
import { ContractState, PerformanceType } from '@utils/enum-utils';
import { AdditionDto, ShboDto } from './dto/addition.dto';
import Worker from '../../../human-resource/member/worker/worker.entity';
import Trees from '../../../human-resource/tree/tree.entity';
import ContractViewUser from '../../../contract/view-users/view-users.entity';
import { RelationIdDto } from '@utils/dto/relation-id.dto';
@Entity('contract_employment_i')
export default class EmploymentContract extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'com_id', nullable: true }) // Байгууллагын id
  public comId: number;

  @Column({ name: 'author_id', nullable: true }) // Нэмсэн хүний id
  public authorId: number;

  @Column('int', { array: true, name: 'tree_ids', nullable: true })
  treeIds?: number[]; // Харах эрхтэй хэрэглэгчид

  @Column('int', { array: true, name: 'view_user_ids', nullable: true })
  viewUserIds?: number[]; // Харах эрхтэй хэрэглэгчид

  @Column({ name: 'tree_id', nullable: true }) // Албан тушаал
  public treeId: number;
  // @ManyToOne(() => Trees, (tree: Trees) => tree.employmentContract)
  // @JoinColumn({ name: 'tree_id' })
  // tree: Trees;

  // @ManyToMany(() => Trees)
  // @JoinTable({
  //   name: 'user_tree_mapping_employmentContract',
  //   joinColumn: { name: 'employmentContract_id', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'tree_id', referencedColumnName: 'id' },
  // })
  // trees: Trees[]; // Харах эрхтэй байгууллагын бүтэц

  @Column({ name: 'type_id', nullable: true }) //Гэрээний төрөл
  public typeId: number;
  @ManyToOne(() => Type, (type: Type) => type.contracts)
  @JoinColumn({ name: 'type_id' })
  type?: Type;

  @Column({ name: 'is_contract_add', default: false, nullable: true }) // нэмэлт гэрээ эсэх
  public isContractAdd: boolean;

  @Column({ name: 'main_contract_id', nullable: true }) // нэмэлт гэрээ id /*to do add relation*/
  public mainContractId: number;

  @Column({ name: 'canceled_date', type: 'timestamptz', nullable: true })
  canceledDate: Date; // Гэрээ цуцалсан огноо

  @Column('varchar', {
    length: 4000,
    name: 'main_contract_name',
    nullable: true,
  })
  mainContractName: string; // нэмэлт гэрээ нэр

  @Column({
    type: 'enum',
    enum: ContractState,
    nullable: true,
    name: 'state',
  })
  public state: ContractState;

  @Column({ name: 'void_contract', nullable: true })
  voidContract: number; // Энэ гэрээ байгууллагдснаар хүчингүй болгосон гэрээ
  @ManyToOne(
    () => EmploymentContract,
    (employmentContract: EmploymentContract) => employmentContract.parent,
  )
  @JoinColumn({ name: 'void_contract' })
  children: EmploymentContract;

  @OneToMany(
    () => EmploymentContract,
    (employmentContract: EmploymentContract) => employmentContract.children,
  )
  parent: EmploymentContract[];

  @Column('varchar', { length: 201, nullable: true })
  number: string; // Гэрээний дугаар

  @Column('varchar', { name: 'num_key', length: 100, nullable: true })
  numKey: string; // Дугаарлалт

  @Column({ name: 'place_country_id', nullable: true })
  placeCountryId: number; // Хаана байгуулсан Улс

  @Column({ name: 'place_city_id', nullable: true })
  placeCityId: number; // Хаана байгуулсан хот

  @Column({ name: 'place_commettee_id', nullable: true })
  placeCommetteeId: number;

  @Column({ name: 'place_district_id', nullable: true })
  placeDistrictId: number;

  @Column('varchar', { length: 4000, nullable: true })
  place: string; // Гэрээ байгуулсан газар

  @Column({ name: 'is_time', nullable: true }) // Хугцаагүй эсэх
  public isTime: boolean;

  @Column({ name: 'contract_create_date', type: 'timestamptz', nullable: true })
  contractCreateDate: Date; // Байгуулсан онгоо

  @Column({ name: 'add_date', type: 'timestamptz', nullable: true })
  addDate: Date; // Гэрээ эхлэх огноо

  @Column({ name: 'end_date', type: 'timestamptz', nullable: true })
  endDate: Date; // Гэрээ дуусах огноо

  @Column('varchar', { length: 4000, name: 'duration_of_year', nullable: true })
  durationOfYear: string; // Үргэлжлэх хугацаа жил

  @Column('varchar', {
    length: 4000,
    name: 'duration_of_month',
    nullable: true,
  })
  durationOfMonth: string; // Үргэлжлэх хугацаа сар

  @Column('varchar', { length: 4000, name: 'duration_of_day', nullable: true })
  durationOfDay: string; // Үргэлжлэх хугацаа өдөр

  @Column('varchar', { length: 4000, nullable: true })
  comment: string; // Тайлбар

  /* Гарын үсэг */
  @Column({ name: 'our_confirm_id', nullable: true })
  ourConfirmId: number; // Баталсан албан тушаалтан
  // @ManyToOne(() => Worker, (worker: Worker) => worker.employmentContractOur)
  // @JoinColumn({ name: 'our_confirm_id' })
  // public ourConfirmWorker?: Worker;

  @Column({ name: 'worker_id', nullable: true })
  workerId: number; // Ажилтан нэр
  // @ManyToOne(() => Worker, (worker: Worker) => worker.employmentContract, {
  //   nullable: true,
  //   onUpdate: 'CASCADE',
  // })
  // @JoinColumn({ name: 'worker_id' })
  // public workers?: Worker;

  @Column({ name: 'salary', type: 'bigint', nullable: true })
  salary: bigint; // Үндсэн цалин

  @Column({
    type: 'enum',
    name: 'salary_type',
    enum: PerformanceType,
    nullable: true,
  })
  public salaryType: PerformanceType; // Цалингийн нэгж

  @Column({ name: 'is_addition', nullable: true }) // Нэмэгдэл нэмэлт хөлстэй эсэх
  public isAddition: boolean;

  @Column({ type: 'jsonb', nullable: true })
  public addition: AdditionDto[]; // Хуваарь төлөлт

  @Column({ name: 'is_shbo', nullable: true }) // ШБО-тэй эсэх
  public isShbo: boolean;

  @Column({ type: 'jsonb', nullable: true })
  public shbo: ShboDto[]; // ШБО

  @Column('varchar', { name: 'short_comment', length: 500, nullable: true })
  shortComment: string; // Тайлбар 2

  @Column({ nullable: true }) // *Гэрээ, гэрээний хавстралыг оруулна уу.
  public file1: number;

  @Column({ nullable: true }) // Гэрээ дүгнэсэн акттай бол актыг оруулна уу
  public file2: number;

  @Column({ type: 'jsonb', name: 'fileIds', nullable: true })
  public fileIds: RelationIdDto[]; // FILE UPLOAD

  @OneToMany(
    () => ContractViewUser,
    (viewUser: ContractViewUser) => viewUser.employmentContract,
    { onUpdate: 'CASCADE' },
  )
  public viewUsers: ContractViewUser[]; // Гэрээ харах хэрэглэгчид

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
