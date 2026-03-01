import { HolidayState } from '../../../../utils/globalUtils';
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
import Holiday from './holiday.entity';
import Worker from '../../../human-resource/member/worker/worker.entity';
@Entity('human_resource_holiday_byuser_k')
export default class HolidayByuser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, name: 'user_id' })
  userId: number;
  @ManyToOne(() => Worker, (workers: Worker) => workers.holidayByusers)
  @JoinColumn({ name: 'user_id' })
  workers?: Worker;

  @Column({ nullable: true, name: 'item_id' })
  itemId: number;
  @ManyToOne(() => Holiday, (holidays: Holiday) => holidays.holidayByusers)
  @JoinColumn({ name: 'item_id' })
  holidays?: Holiday;

  @Column({ nullable: true })
  mid: number;

  @Column({
    type: 'enum',
    enum: HolidayState,
    nullable: true,
  })
  public state: HolidayState;

  @Column({ name: 'is_new', default: false, nullable: true })
  isNew: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
