import Directs from '../../schedule/direct/entities/direct.entity';
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
@Entity('time_access_schedule_direct_lost_i') // Торгуульы
export default class DirectLosts extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'direct_id', nullable: true })
  directId: number; //Direct id
  @ManyToOne(() => Directs, (direct: Directs) => direct.directLost)
  @JoinColumn({ name: 'direct_id' })
  direct: Directs;

  @Column('varchar', { length: 20, nullable: true })
  day: string; //'Mon','Tue','Wed','Thu','Fri','Sat','Sun'

  @Column('varchar', { name: 'start_time', length: 5, nullable: true })
  startTime: string; //Торгууль эхлэх цаг

  @Column('varchar', { name: 'end_time', length: 5, nullable: true })
  endTime: string; //Торгууль дуусах цаг

  @Column({ nullable: true })
  money: number; //Торгох мөнгө

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
