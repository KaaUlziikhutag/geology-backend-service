import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_holiday_shift_note_i')
export default class HolidayShiftNote extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, name: 'autor_id' })
  autorId: number;

  @Column({ nullable: true, name: 'item_id' })
  itemId: number;

  @Column({ nullable: true, name: 'com_id' })
  comId: number;

  @Column({ nullable: true, name: 'shift_id' })
  shiftId: number;

  @Column('varchar', { length: 200, nullable: true })
  note: string;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
