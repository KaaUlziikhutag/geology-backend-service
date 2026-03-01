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
import Category from '../option/category/category.entity';
import DecisionViewUser from '../view-users/view-users.entity';
import Trees from '../../human-resource/tree/tree.entity';
import Type from '../option/type/type.entity';
import Worker from '../../human-resource/member/worker/worker.entity';
import {
  ContractState,
  FileDto,
  ProgressStatus,
  SecurityLevel,
} from '../../../utils/globalUtils';

@Entity('decision_inner_i') //Дотоод тушаал шийдвэр
export default class Inner extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'com_id', nullable: true }) //Компаний id
  public comId: number;

  @Column({ name: 'author_id', nullable: true })
  public authorId: number; //Author

  @Column({ name: 'void_contract', nullable: true })
  voidContract: number; // Энэ гэрээ байгууллагдснаар хүчингүй болгосон гэрээ
  @ManyToOne(() => Inner, (inner: Inner) => inner.parent)
  @JoinColumn({ name: 'void_contract' })
  children: Inner;

  @OneToMany(() => Inner, (inner: Inner) => inner.children)
  parent: Inner[];

  @Column('int', { array: true, name: 'worker_ids', nullable: true })
  workerIds?: number[];

  @Column('int', { array: true, name: 'tree_ids', nullable: true })
  treeIds?: number[];

  @Column('int', {
    array: true,
    name: 'implementation_with_ids',
    nullable: true,
  })
  implementationWithIds?: number[];

  @Column('int', { array: true, name: 'supervisor_ids', nullable: true })
  supervisorIds?: number[];

  @Column('int', { array: true, name: 'author_user_ids', nullable: true })
  authorUserIds?: number[];

  @Column('int', { array: true, name: 'signUser_ids', nullable: true })
  signUserIds?: number[];

  @Column('int', { array: true, name: 'view_user_ids', nullable: true })
  viewUserIds?: number[];

  @ManyToMany(() => Trees)
  @JoinTable({
    name: 'user_tree_mapping',
    joinColumn: { name: 'decision_inner_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tree_id', referencedColumnName: 'id' },
  })
  trees: Trees[]; // Гэрээг харах эрхтэй байгууллагын бүтэц

  @ManyToMany(() => Worker)
  @JoinTable({
    name: 'user_worker_mapping',
    joinColumn: { name: 'decision_inner_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'worker_id', referencedColumnName: 'id' },
  })
  workers: Worker[]; // Тушаал, шийдвэрт шууд хамаарах албан тушаалтан

  @Column({ name: 'confirm_user_id', nullable: true })
  public confirmUserId: number; // Баталсан албан тушаалтан
  @ManyToOne(() => Worker, (worker: Worker) => worker.confirmInner)
  @JoinColumn({ name: 'confirm_user_id' })
  public confirmInnerWorker?: Worker;

  @ManyToMany(() => Worker)
  @JoinTable({
    name: 'user_supervisor_id_mapping',
    joinColumn: { name: 'decision_inner_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'supervisor_id', referencedColumnName: 'id' },
  })
  supervisorInnerWorkers: Worker[]; // Хяналт тавих албан тушаалтан

  @ManyToMany(() => Worker)
  @JoinTable({
    name: 'implementation_withs',
    joinColumn: { name: 'decision_inner_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'implementation_withs',
      referencedColumnName: 'id',
    },
  })
  implementationWiths: Worker[]; // Хэрэгжүүлэх албан тушаалтан

  @ManyToMany(() => Worker)
  @JoinTable({
    name: 'user_author_user_id_mapping',
    joinColumn: { name: 'decision_inner_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'author_user_id', referencedColumnName: 'id' },
  })
  authorInnerWorkers: Worker[]; // Боловсруулсан ажилтан

  @ManyToMany(() => Worker)
  @JoinTable({
    name: 'user_sign_user_id_mapping',
    joinColumn: { name: 'decision_inner_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'sign_user_id', referencedColumnName: 'id' },
  })
  signWorkers: Worker[]; // Зөвшөөрсөн албан тушаалтнууд

  @Column({ name: 'group_id', default: 0, nullable: true })
  public groupId: number; //Бүлэг id

  @Column({ name: 'type_id', nullable: true })
  public typeId: number; // Тушаал шийдвэр id
  @ManyToOne(() => Type, (type: Type) => type.inner)
  @JoinColumn({ name: 'type_id' })
  types?: Type;

  @Column({ name: 'is_time', default: false, nullable: true }) // Хугцаагүй эсэх
  public isTime: boolean;

  @Column('varchar', { length: 255, nullable: true })
  type: string; // Тушаал шийдвэр төрөл //Enum

  @Column({ nullable: true })
  public year: number; //Жил

  @Column({ name: 'number', length: 400, nullable: true })
  public number: string; //Дугаарлалт key A

  @Column({ name: 'sub_number', nullable: true })
  public subNumber: string; //Бичгийн дэд дугаар

  @Column('varchar', { name: 'comment', length: 500, nullable: true })
  comment: string; //Тайлбар

  @Column({ name: 'card_number', nullable: true })
  public cardNumber: string; //Бичгийн картын дугаар

  @Column({
    type: 'enum',
    enum: ContractState,
    nullable: true,
  })
  public state: ContractState;

  @Column({ name: 'canceled_date', type: 'timestamptz', nullable: true })
  canceledDate: Date; // Гэрээ цуцалсан огноо

  @Column('varchar', { length: 300, nullable: true })
  name: string; //Тушаал шийдвэрийн нэр

  @Column('varchar', { length: 300, nullable: true })
  rule: string; //Тушаал шийдвэрийн дүрэм хамрах хүрээ text

  @Column({ default: 0 })
  public pageCount: number; //Хуудасны тоо

  @Column({ default: 0 })
  public unitCount: number; //Ботийн тоо

  @Column({ name: 'own_date', type: 'timestamptz', nullable: true })
  ownDate: Date; //Бичиг дээрх огноо

  @Column({ name: 'exc_date', type: 'timestamptz', nullable: true })
  excDate: Date; //Биелүүлж эхлэх огноо

  @Column({ name: 'end_date', type: 'timestamptz', nullable: true })
  endDate: Date; //Биелүүлж дуусах огноо

  @Column({ name: 'send_date', type: 'timestamptz', nullable: true })
  sendDate: Date; //Илгээсэн огноо

  @Column({ name: 'answered_date', type: 'timestamptz', nullable: true })
  answeredDate: Date; //Хариу өгөх огноо

  @Column({ name: 'category_id', nullable: true }) //Гэрээний ангилал
  public categoryId: number;
  @ManyToOne(() => Category, (category: Category) => category.inners)
  @JoinColumn({ name: 'category_id' })
  category?: Category;

  @Column({
    type: 'enum',
    enum: ProgressStatus,
    nullable: true,
    name: 'is_exc',
  })
  public isExc: ProgressStatus;

  @Column({
    type: 'enum',
    enum: SecurityLevel,
    nullable: true,
    name: 'is_secret',
  })
  public isSecret: SecurityLevel; //Нууц эсэх

  @Column({ name: 'is_instant', default: false, nullable: true })
  public isInstant: boolean; //Яаралтай эсэх

  @Column({ name: 'is_draft', default: false, nullable: true })
  public isDraft: boolean; // Ноорог эсэх

  @Column({ name: 'is_inner', default: false, nullable: true })
  public isInner: boolean; //Дотоод тушаал шийдвэр эсэх

  @Column({ type: 'jsonb', name: 'fileIds', nullable: true })
  public fileIds: FileDto[]; // FILE UPLOAD

  @Column({ name: 'file_id', nullable: true }) // *file хавстралыг оруулна уу.
  public fileId: number;

  @Column({ name: 'inner_id', nullable: true }) //  энэ тушаал шийдвэр батлагдсанаар хүчингүй болгосон баримт бичиг
  public innerId: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  @OneToMany(
    () => DecisionViewUser,
    (viewUser: DecisionViewUser) => viewUser.inner,
    { onUpdate: 'CASCADE' },
  )
  public viewUsers: DecisionViewUser[]; // Тушаал харах хэрэглэгчид
}
