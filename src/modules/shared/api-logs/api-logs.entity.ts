import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('api_logs')
class ApiLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 50 })
  system_name: string;

  @Column('varchar', { length: 50 })
  request_type: string;

  @Column()
  status_code: number;

  @Column()
  user_id: number;

  @Column()
  company_id: number;

  @Column('varchar', { length: 250 })
  company_name: string;

  @Column()
  error_msg: string;

  @Column({ type: 'text' })
  request_payload: string;

  @Column({ type: 'text' })
  responce_payload: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

export default ApiLog;
