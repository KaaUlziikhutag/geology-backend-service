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
import Category from '../option/category/category.entity';
import DecisionViewUser from '../view-users/view-users.entity';
import Trees from '../../human-resource/tree/tree.entity';
import {
  ContractState,
  ProgressStatus,
  SecurityLevel,
} from '@utils/enum-utils';
import Type from '../option/type/type.entity';
import Worker from '../../human-resource/member/worker/worker.entity';
import CategoryOrganization from '../../shared/category/category.entity';
import { RelationIdDto } from '@utils/dto/relation-id.dto';

@Entity('decision_above_i') // Дээд тушаал шийдвэр
export default class Above extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'com_id', nullable: true }) //Компаний id
  public comId: number;

  @Column({ name: 'author_id', nullable: true })
  public authorId: number; //Author

  @Column({ name: 'group_id', nullable: true })
  public groupId: number; //Бүлэг id

  @ManyToMany(() => Trees)
  @JoinTable({
    name: 'user_tree_mapping_above',
    joinColumn: { name: 'decision_above_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tree_id', referencedColumnName: 'id' },
  })
  trees: Trees[]; // Харах эрхтэй байгууллагын бүтэц

  @Column('int', { array: true, name: 'view_user_ids', nullable: true })
  viewUserIds?: number[]; // Харах эрхтэй хэрэглэгчид

  @Column('int', { array: true, name: 'tree_ids', nullable: true })
  treeIds?: number[]; // Харах эрхтэй хэрэглэгчид

  @Column('int', { array: true, name: 'supervisor_ids', nullable: true })
  supervisorIds?: number[];

  @Column('int', {
    array: true,
    name: 'implementation_with_ids',
    nullable: true,
  })
  implementationWithIds?: number[];

  @ManyToMany(() => Worker)
  @JoinTable({
    name: 'user_worker_mapping_above',
    joinColumn: { name: 'decision_above_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'worker_id', referencedColumnName: 'id' },
  })
  workers: Worker[]; // Тушаал, шийдвэрт шууд хамаарах ажилтан

  @Column({ name: 'out_confirm_name', nullable: true })
  public outConfirmName: string; // Батлах хүний нэр

  @ManyToMany(() => Worker)
  @JoinTable({
    name: 'user_supervisor_id_mapping_above',
    joinColumn: { name: 'decision_above_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'supervisor_id', referencedColumnName: 'id' },
  })
  supervisorAboveWorkers: Worker[]; // Хяналт тавих албан тушаалтан

  @ManyToMany(() => Worker)
  @JoinTable({
    name: 'user_implementation_id_mapping_above',
    joinColumn: { name: 'decision_inner_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'implementation_withs',
      referencedColumnName: 'id',
    },
  })
  implementationWiths: Worker[]; // Хэрэгжүүлэх албан тушаалтан

  @Column({
    type: 'enum',
    enum: ContractState,
    nullable: true,
  })
  public state: ContractState;

  @Column({
    type: 'enum',
    enum: ProgressStatus,
    nullable: true,
    name: 'is_exc',
  })
  public isExc: ProgressStatus; // Биелэлт тооцох

  @Column({
    type: 'enum',
    enum: SecurityLevel,
    nullable: true,
    name: 'is_secret',
  })
  public isSecret: SecurityLevel; //Нууц эсэх

  @Column({ name: 'canceled_date', type: 'timestamptz', nullable: true })
  canceledDate: Date; // Гэрээ цуцалсан огноо

  @Column({ name: 'type_id', nullable: true })
  public typeId: number; // Тушаал шийдвэр id
  @ManyToOne(() => Type, (type: Type) => type.above)
  @JoinColumn({ name: 'type_id' })
  types?: Type;

  @Column('varchar', { length: 255, nullable: true })
  type: string; // Тушаал шийдвэр төрөл

  @Column({ nullable: true })
  public year: number; //Жил

  @Column({ name: 'is_time', default: false, nullable: true }) // Хугцаагүй эсэх
  public isTime: boolean;

  @Column({ name: 'number', nullable: true })
  public number: string; //Дугаарлалт key A

  @Column({ name: 'sub_number', nullable: true })
  public subNumber: string; //Бичгийн дэд дугаар

  @Column({ name: 'card_number', nullable: true })
  public cardNumber: number; //Бичгийн картын дугаар

  @Column('varchar', { length: 300, nullable: true })
  name: string; //Тушаал шийдвэрийн нэр

  @Column('varchar', { length: 300, nullable: true })
  rule: string; //Тушаал шийдвэрийн дүрэм хамрах хүрээ

  @Column({ name: 'author_user_id', nullable: true })
  public authorUserId: number; // Боловсруулсан ажилтан
  // @ManyToOne(() => Worker, (worker: Worker) => worker.authorAbove)
  // @JoinColumn({ name: 'author_user_id' })
  // public authorAboveWorker?: Worker;

  @Column({ name: 'sign_user_id', nullable: true })
  public signUserId: number; //Гарын үсэг зурсан ажилтан
  // @ManyToOne(() => Worker, (worker: Worker) => worker.above)
  // @JoinColumn({ name: 'sign_user_id' })
  // public signAboveWorker?: Worker;

  @Column({ default: 0 })
  public pageCount: number; //Хуудасны тоо

  @Column({ name: 'void_contract', nullable: true })
  voidContract: number; // Энэ гэрээ байгууллагдснаар хүчингүй болгосон гэрээ
  @ManyToOne(() => Above, (above: Above) => above.parent)
  @JoinColumn({ name: 'void_contract' })
  children: Above;

  @OneToMany(() => Above, (above: Above) => above.children)
  parent: Above[];

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
  @ManyToOne(() => Category, (category: Category) => category.aboves)
  @JoinColumn({ name: 'category_id' })
  category?: Category;

  @Column({ name: 'organization_id', nullable: true }) // Хариуцагч байгууллагын id
  public organizationId: number;
  @ManyToOne(
    () => CategoryOrganization,
    (categoryOrganization: CategoryOrganization) => categoryOrganization.aboves,
  )
  @JoinColumn({ name: 'organization_id' })
  categoryOrganization?: CategoryOrganization;

  @Column({ name: 'is_instant', default: false, nullable: true })
  public isInstant: boolean; //Яаралтай эсэх

  @Column({ name: 'is_draft', default: false, nullable: true })
  public isDraft: boolean; // Ноорог эсэх

  @Column({ name: 'is_inner', default: false, nullable: true })
  public isInner: boolean; //Дотоод тушаал шийдвэр эсэх

  @Column({ type: 'jsonb', name: 'fileIds', nullable: true })
  public fileIds: RelationIdDto[]; // FILE UPLOAD

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  @OneToMany(
    () => DecisionViewUser,
    (viewUser: DecisionViewUser) => viewUser.above,
    { onUpdate: 'CASCADE' },
  )
  public viewUsers: DecisionViewUser[]; //Тушаал харах хэрэглэгчид
}
