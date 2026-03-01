import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('shared_group_filter')
export default class GroupFilter extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, name: 'group_id' })
  groupId: number;

  @Column({ nullable: true, name: 'user_id' })
  userId: number;

  @Column('varchar', { length: 300, nullable: true })
  datas: string;

  @Column('varchar', { length: 300, nullable: true, name: 'sender_datas' })
  senderDatas: string;

  @Column('varchar', {
    length: 300,
    nullable: true,
    name: 'outer_dender_datas',
  })
  outerSenderDatas: string;

  @Column('varchar', { length: 300, nullable: true })
  field: string;

  @Column('varchar', { length: 300, nullable: true })
  value: string;

  @Column('varchar', { length: 300, nullable: true, name: 'choose_value' })
  chooseValue: string;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
