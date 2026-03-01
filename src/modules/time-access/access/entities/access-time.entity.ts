import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('time_access_access_time_i')
export default class AccessTimes extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'autor_id', nullable: true })
  autorId: number;

  @Column({ name: 'lost_time', nullable: true })
  lostTime: number;

  @Column({ name: 'terminal_number', nullable: true })
  terminalNumber: number;

  @Column({ name: 'lost_money', nullable: true })
  lostMoney: number;

  @Column({ name: 'over_time', nullable: true })
  overTime: number;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @Column({ nullable: true })
  type: number;

  @Column('varchar', { length: 30, nullable: true })
  ip: string;

  @Column({ name: 'is_terminal', default: false })
  isTerminal: boolean;

  @Column({ name: 'is_cancel', default: false })
  isCancel: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
