import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('time_access_access_temp_i')
export default class AccessTempTimes extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'code', length: 30, nullable: true })
  code: string;

  @Column({ name: 'time1', length: 30, nullable: true })
  time1: string;

  @Column({ name: 'com_id', nullable: true })
  comId: number;

  @Column({ name: 'name', length: 256, nullable: true })
  state: string;

  @Column({ type: 'date', nullable: true })
  sdate: Date;

  @Column({ type: 'jsonb', nullable: true })
  result?: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
