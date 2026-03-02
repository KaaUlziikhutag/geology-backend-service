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
} from 'typeorm';
import { AppointmentStatusType } from '@utils/enum-utils';
import Worker from '../../../../human-resource/member/worker/worker.entity';
@Entity('time_access_schedule_direct_history')
export default class DirectHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'direct_id', nullable: true }) // Гэрээний id
  public directId: number;

  @Column({ name: 'com_id', nullable: true })
  comId: number; // company id

  @Column({
    type: 'enum',
    enum: AppointmentStatusType,
    default: AppointmentStatusType.Expected,
    nullable: true,
  })
  public status: AppointmentStatusType;

  @Column({ name: 'author_id', nullable: true })
  authorId: number; // нэмсэн хүний id
  @JoinColumn({ name: 'author_id' })
  @ManyToOne(() => Worker)
  author?: Worker;

  @Column('varchar', { length: 250, nullable: true })
  authorName: string; //

  @Column('varchar', { length: 4000, nullable: true })
  closeNote: string; //

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @Column({ name: 'confirm_id', nullable: true })
  confirmId: number; // Баталсан хүн
  @JoinColumn({ name: 'confirm_id' })
  @ManyToOne(() => Worker)
  confirm?: Worker;

  @Column({ name: 'confirm_date', type: 'timestamptz', nullable: true })
  confirmDate: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
