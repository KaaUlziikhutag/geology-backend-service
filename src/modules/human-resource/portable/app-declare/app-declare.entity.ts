import { StateType } from '@utils/enum-utils';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_worker_app_declare_i')
export default class AppDeclare extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'com_id', nullable: true })
  comId: number;

  @Column({ name: 'autor_id', nullable: true })
  autorId: number;

  @Column({ name: 'app_id', nullable: true })
  appId: number;

  @Column({ nullable: true })
  cnt: number;

  @Column('varchar', { name: 'app_name', length: 800, nullable: true })
  appName: string;

  @Column('varchar', { length: 800, nullable: true })
  requirement: string;

  @Column('varchar', { name: 'app_role', length: 800, nullable: true })
  appRole: string;

  @Column('varchar', { name: 'addition_info', length: 800, nullable: true })
  additionInfo: string;

  @Column({
    type: 'enum',
    enum: StateType,
    nullable: true,
  })
  public state: StateType;

  @Column({ name: 'start_date', type: 'timestamptz', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamptz', nullable: true })
  endDate: Date;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
