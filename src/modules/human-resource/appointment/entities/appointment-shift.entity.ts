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
@Entity('human_resource_appointment_shift_i')
export default class AppointmentShifts extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'item_id', nullable: true })
  itemId: number; // appointment-i id

  @Column({ name: 'com_id', nullable: true })
  comId: number; // company id

  @Column({ name: 'receiver_id', nullable: true })
  receiverId: number; // шилжүүлсэн хүний id

  @Column({ name: 'sender_id', nullable: true })
  senderId: number; // өөрийн id

  @Column({ name: 'author_id', nullable: true })
  authorId: number; // нэмсэн хүний id

  @Column('varchar', { length: 250, nullable: true })
  authorName: string; //

  @Column({
    type: 'enum',
    enum: AppointmentStatusType,
    default: AppointmentStatusType.Expected,
    nullable: true,
  })
  public status: AppointmentStatusType;

  @Column('varchar', { length: 400, nullable: true })
  note: string; // тайлбар /*удирдлагын заалт*/

  @Column({ name: 'is_start', default: false })
  isStart: boolean;

  @Column({ name: 'shift_date', type: 'timestamptz', nullable: true })
  shiftDate: Date;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @Column({ name: 'confirm_id', nullable: true })
  confirmId: number; // Баталсан хүн

  @Column({ name: 'confirm_date', type: 'timestamptz', nullable: true })
  confirmDate: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
