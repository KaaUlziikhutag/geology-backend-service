import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  JoinTable,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Trees from '../../../../../human-resource/tree/tree.entity';
import Repeats from '../../entities/repeat.entity';
import RepeatDetailViewUser from './repeat-user.entity';
import Graphic from '../../graphic/entity/graphic.entity';
@Entity('time_access_repeat_detail_i')
export default class RepeatDetails extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 4000, nullable: true })
  name: string; // Ээлжийн нэр

  @Column({ name: 'graphic_id', nullable: true })
  graphicId: number; // График id
  @ManyToOne(() => Graphic, { nullable: true })
  @JoinColumn({ name: 'graphic_id' })
  graphic: Graphic;

  @Column({ name: 'start_position', nullable: true })
  startPosition: number;

  @Column({ name: 'repeat_id', nullable: true })
  repeatId: number;
  @ManyToOne(() => Repeats, (repeat: Repeats) => repeat.repeatDetails)
  @JoinColumn({ name: 'repeat_id' })
  public repeats: Repeats;

  @Column('int', { array: true, name: 'tree_ids', nullable: true })
  treeIds?: number[]; // Хамаарах алба нэгж

  @Column({ name: 'position', nullable: true }) //Position
  position: number;

  @ManyToMany(() => Trees)
  @JoinTable({
    name: 'repeat_detail_tree_mapping',
    joinColumn: { name: 'direct', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tree_id', referencedColumnName: 'id' },
  })
  trees: Trees[]; // Хамаарах алба нэгж байгууллагын бүтэц

  @Column('int', { array: true, name: 'view_user_ids', nullable: true })
  viewUserIds?: number[]; // Харах эрхтэй хэрэглэгчид

  @OneToMany(
    () => RepeatDetailViewUser,
    (viewUser: RepeatDetailViewUser) => viewUser.directdDetail,
  )
  public viewUsers: RepeatDetailViewUser[]; // Хамаарах хэрэглэгчид

  @Column({ name: 'autor_id', nullable: true }) //Author id
  autorId: number;

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
