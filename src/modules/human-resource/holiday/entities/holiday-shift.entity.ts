import { AppointmentStatusType } from '@utils/enum-utils';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_holiday_shift_i')
export default class HolidayShift extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, name: 'item_id' })
  itemId: number;

  @Column({ nullable: true, name: 'com_id' })
  comId: number;

  @Column({ nullable: true, name: 'receiver_id' })
  receiverId: number;

  @Column({ nullable: true, name: 'sender_id' })
  senderId: number;

  @Column({ nullable: true, name: 'author_id' })
  authorId: number;

  @Column('varchar', { length: 250, nullable: true })
  authorName: string; //

  @Column('varchar', { length: 200, nullable: true })
  rule: string;

  @Column({ name: 'is_start', default: false, nullable: true })
  isStart: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @Column({ name: 'shift_date', type: 'date', nullable: true })
  shiftDate: Date;

  @Column({ nullable: true, name: 'confirm_id' })
  confirmId: number;

  @Column('varchar', { length: 250, nullable: true })
  note: string; // Тайлбар

  @Column({
    type: 'enum',
    enum: AppointmentStatusType,
    default: AppointmentStatusType.Expected,
    nullable: true,
  })
  public holidayType: AppointmentStatusType;

  @Column({ name: 'confirm_date', type: 'date', nullable: true })
  confirmDate: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
