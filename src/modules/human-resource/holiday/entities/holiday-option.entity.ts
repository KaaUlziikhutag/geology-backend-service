import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_holiday_option_i')
export default class HolidayOption extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, name: 'item_id' })
  itemId: number;

  @Column({ nullable: true, name: 'com_id' })
  comId: number;

  @Column('varchar', { length: 200, name: 'group_name', nullable: true })
  groupName: string;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
