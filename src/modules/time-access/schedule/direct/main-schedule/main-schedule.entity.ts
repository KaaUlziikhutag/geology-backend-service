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
import Directs from '../entities/direct.entity';
@Entity('time_access_schedule_direct_main_schedule_i')
export default class MainSchedules extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'direct_id', nullable: true })
  directId: number; //Direct id
  @ManyToOne(() => Directs, (direct: Directs) => direct.mainSchedules)
  @JoinColumn({ name: 'direct_id' })
  direct: Directs;

  @Column('varchar', { length: 30, nullable: true })
  day: string; //' 1 Mon',' 2 Tue',' 3 Wed',' 4 Thu','5 Fri','Sat','Sun'

  @Column('varchar', { length: 30, nullable: true })
  time1: string; //Ажилдаа ирэх цаг

  @Column('varchar', { length: 30, nullable: true })
  time4: string; //Ажилдаа тарах цаг

  @Column('varchar', { length: 30, nullable: true })
  time5: string; // Ажиллах цаг минут

  @Column({ name: 'is_time_limit', default: false, nullable: true })
  isTimeLimit: boolean; // ирж явах цагийн хязгаарлалт

  @Column('varchar', { name: 'limit_time_start', length: 30, nullable: true })
  limitTimeStart: string; // ирэх  цагийн хязгаарлалт

  @Column('varchar', { name: 'limit_time_end', length: 30, nullable: true })
  limitTimeEnd: string; // явах  цагийн хязгаарлалт

  @Column({ nullable: true })
  type: number; // Тогтмол Ээлж

  @Column({ name: 'is_restday', nullable: true })
  isRestday: number; //Ажлын өдөр - 0  Амралтын өдөр- 1 Баяр ёслолын өдөр -2

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
