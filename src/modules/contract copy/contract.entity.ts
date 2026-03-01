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
  ManyToMany,
  JoinTable,
} from 'typeorm';
import Type from './option/type/type.entity';
import ContractViewUser from './view-users/view-users.entity';
import ContractDelegateOur from './delegate-our/delegate-our.entity';
import ContractDelegateOut from './delegate-out/delegate-out.entity';
import { ContractState, FileDto } from '../../utils/globalUtils';
import { SchudleDto } from './dto/schudle.dto';
import Trees from '../human-resource/tree/tree.entity';
import Worker from '../human-resource/member/worker/worker.entity';
import CategoryOrganization from '../shared/category/category.entity';

@Entity('contract_i')
export default class Contract extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'com_id', nullable: true }) //Байгууллагын id
  public comId: number;

  @Column({ name: 'author_id', nullable: true }) //Нэмсэн хүний id
  public authorId: number;

  @Column({ name: 'group_id', default: 0 }) // Бүлгийн id
  public groupId: number;

  @Column('varchar', { length: 300, nullable: true })
  title: string; //Гэрээний гарчиг нэр

  @Column({ name: 'is_schedule', default: false, nullable: true }) // Хугцаагүй эсэх
  public isSchedule: boolean;

  @Column({ name: 'is_contract_add', default: false, nullable: true }) // Нэмэлт гэрээ эсэх
  public isContractAdd: boolean;

  @Column({ name: 'is_unique_value', default: false, nullable: true }) // Алданги тооцох эсэх
  public isUniqueValue: boolean;

  @Column({ type: 'jsonb', nullable: true })
  public schedule: SchudleDto[]; // Хуваарь төлөлт

  @Column({ name: 'main_contract_id', nullable: true }) // нэмэлт гэрээ id
  public mainContractId: number;

  @Column('varchar', {
    length: 4000,
    name: 'main_contract_name',
    nullable: true,
  })
  mainContractName: string; // нэмэлт гэрээ нэр

  @Column('varchar', {
    length: 4000,
    name: 'overside_contract_number',
    nullable: true,
  })
  overSideContractNumber: string; // Нөгөө талын гэрээний дугаар

  @Column('int', { array: true, name: 'view_user_ids', nullable: true })
  viewUserIds?: number[];

  @Column('int', { array: true, name: 'tree_ids', nullable: true })
  treeIds?: number[]; // Харах эрхтэй хэрэглэгчид

  @ManyToMany(() => Trees)
  @JoinTable({
    name: 'user_tree_mapping_contract',
    joinColumn: { name: 'contract_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tree_id', referencedColumnName: 'id' },
  })
  trees: Trees[]; // Харах эрхтэй байгууллагын бүтэц

  @Column({ name: 'created_at_country', nullable: true })
  public createdAtCountry: number; //Хэлтсийн id

  @Column({ name: 'created_at_city', nullable: true })
  public createdAtCity: number; //Хэлтсийн id

  @Column('varchar', { length: 4000, name: 'duration_of_year', nullable: true })
  durationOfYear: string;

  @Column('varchar', {
    length: 4000,
    name: 'duration_of_month',
    nullable: true,
  })
  durationOfMonth: string;

  @Column({ type: 'jsonb', name: 'fileIds', nullable: true })
  public fileIds: FileDto[]; // FILE UPLOAD

  @Column('varchar', { length: 4000, name: 'duration_of_day', nullable: true })
  durationOfDay: string;

  @Column('varchar', { length: 4000, nullable: true })
  description: string;

  @Column('varchar', { length: 255, nullable: true })
  depName: string; //Хэлтсийн нэр

  @Column({
    type: 'enum',
    enum: ContractState,
    nullable: true,
  })
  public state: ContractState;

  @Column('varchar', { name: 'out_name', length: 300, nullable: true })
  outName: string; // Харилцагч компани

  @Column('varchar', { name: 'out_code', length: 300, nullable: true })
  outCode: string; // Харилцагч компани код

  @Column('varchar', { name: 'our_name', length: 300, nullable: true })
  ourName: string; // Манай компаний

  @Column('varchar', { name: 'out_confirm_name', length: 100, nullable: true })
  outConfirmName: string; // Нөгөө талаас төлөөлж гарын үсэг зүрсан хүн Баталсан

  @Column('varchar', { name: 'our_confirm_name', length: 100, nullable: true })
  ourConfirmName: string; // Манай талаас төлөөлж гарын үсэг зүрсан хүн Зөвшөөрсөн

  @Column({ name: 'our_confirm_id', nullable: true })
  ourConfirmId: number; //Манай талаас төлөөлж гарын үсэг зурсан хүний id
  @ManyToOne(() => Worker, (worker: Worker) => worker.contract)
  @JoinColumn({ name: 'our_confirm_id' })
  public ourConfirmWorker?: Worker;

  @Column('varchar', { length: 4000, nullable: true })
  number: string; // Гэрээний дугаарлалт

  @Column('varchar', { name: 'num_key', length: 100, nullable: true })
  numKey: string; // Төрөл /дугаарлалт A 1

  @Column('varchar', { name: 'num_cnt', length: 100, nullable: true })
  numCnt: string; // Төрөл /дугаарлалт 12

  @Column('varchar', { length: 100, nullable: true })
  place: string; //Гэрээ байгуулсан газар

  @Column('varchar', { name: 'place_country', length: 100, nullable: true })
  placeCountry: string; //Гэрээ байгуулсан газар

  @Column({ name: 'place_country_id', nullable: true })
  placeCountryId: number;

  @Column({ name: 'place_city_id', nullable: true })
  placeCityId: number;

  @Column({ name: 'place_commettee_id', nullable: true })
  placeCommetteeId: number;

  @Column({ name: 'place_district_id', nullable: true })
  placeDistrictId: number;

  @Column({ name: 'contract_create_date', type: 'timestamptz', nullable: true })
  contractCreateDate: Date; // Байгуулсан онгоо

  @Column({ name: 'add_date', type: 'timestamptz', nullable: true })
  addDate: Date; // Гэрээ эхлэх огноо

  @Column({ name: 'end_date', type: 'timestamptz', nullable: true })
  endDate: Date; // Гэрээ дуусах огноо

  @Column({ name: 'canceled_date', type: 'timestamptz', nullable: true })
  canceledDate: Date; // Гэрээ цуцалсан огноо

  @Column({ name: 'is_warraty', nullable: true })
  public isWarraty: boolean; //Гүйцэтгэлийн баталгаа

  @Column({ name: 'warraty_date', type: 'timestamptz', nullable: true })
  warratyDate: Date; //Гүйцэтгэлийн баталгаа хугацаа

  @Column({ name: 'warraty_value', nullable: true })
  warratyValue: number; //Гүйцэтгэлийн баталгаа үнийн дүн

  @Column({ name: 'unique_loss', nullable: true })
  uniqueLoss: number; //Алданги тооцох доод хэмжээ

  @Column({ name: 'unique_perday', nullable: true })
  uniquePerday: number; //Нэг өдөрт тооцох хувь

  @Column({ name: 'is_certificate', nullable: true })
  isCertificate: number; // Гэрээ дүгнэсэн акттай эсэх

  @Column({ type: 'jsonb', name: 'certificate_file_ids', nullable: true })
  public certificatefileIds: FileDto[]; // Гэрээ, гэрээний хавстралыг оруулна уу

  @Column({ name: 'void_contract', nullable: true })
  voidContract: number; // Энэ гэрээ байгууллагдснаар хүчингүй болгосон гэрээ
  @ManyToOne(() => Contract, (contract: Contract) => contract.parent)
  @JoinColumn({ name: 'void_contract' })
  children: Contract;

  @OneToMany(() => Contract, (contract: Contract) => contract.children)
  parent: Contract[];

  @Column({ name: 'unique_max', nullable: true }) //Алданги тооцох дээд хэмжээ
  uniqueMax: number;

  @Column({
    type: 'numeric',
    precision: 99,
    scale: 2,
    default: 0,
    nullable: true,
  })
  payment: number; //Гэрээний үнийн дүн

  @Column('varchar', { length: 10, default: 'MNT', nullable: true })
  currency: string; //Currency

  @Column('varchar', { length: 900, nullable: true })
  outPhone: string;

  @Column('varchar', { name: 'payment_comments', length: 500, nullable: true })
  paymentComments: string; //Төлөх огноо текстээр

  @Column('varchar', { name: 'payment_decision', length: 500, nullable: true })
  priceDecision: string; //Үнийн комиссийн шийдвэр

  @Column('varchar', { name: 'comment', length: 500, nullable: true })
  comment: string; //Тайлбар

  @Column('varchar', { name: 'short_comment', length: 500, nullable: true })
  shortComment: string; //Тайлбар

  @Column({ name: 'is_draft', default: false, nullable: true }) // Is draft
  public isDraft: boolean;

  @Column({ name: 'is_time', default: false, nullable: true }) // Хугцаагүй эсэх
  public isTime: boolean;

  @Column({ name: 'category_id', nullable: true }) // Харилцагчийн төрөл
  public categoryId: number;
  @ManyToOne(
    () => CategoryOrganization,
    (categoryOrganization: CategoryOrganization) =>
      categoryOrganization.contracts,
  )
  @JoinColumn({ name: 'category_id' })
  categoryOrganization?: CategoryOrganization;

  @Column({ name: 'type_id', nullable: true }) //Гэрээний төрөл
  public typeId: number;
  @ManyToOne(() => Type, (type: Type) => type.contracts)
  @JoinColumn({ name: 'type_id' })
  type?: Type;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt: Date;

  @OneToMany(
    () => ContractViewUser,
    (viewUser: ContractViewUser) => viewUser.contract,
    { onUpdate: 'CASCADE', nullable: true },
  )
  public viewUsers: ContractViewUser[]; // Гэрээ харах хэрэглэгчид

  @Column('int', { array: true, nullable: true })
  delegateOurIds?: number[];

  @Column('simple-array', { nullable: true })
  delegateOuts?: string[];

  @OneToMany(
    () => ContractDelegateOur,
    (delegateOur: ContractDelegateOur) => delegateOur.contract,
    { onUpdate: 'CASCADE' },
  )
  public delegateOur: ContractDelegateOur[]; // Гэрээ доторх төлөөлөгчид - Eoffice хэрэглэгчид

  @OneToMany(
    () => ContractDelegateOut,
    (delegateOut: ContractDelegateOut) => delegateOut.contract,
    { onUpdate: 'CASCADE' },
  )
  public delegateOut: ContractDelegateOut[]; // Гэрээ гаднах төлөөлөгчид - Системийн хэрэглэгчид биш
}
