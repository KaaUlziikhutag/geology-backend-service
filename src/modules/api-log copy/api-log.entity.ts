import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('api_logs')
export default class ApiLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'system_name', length: 255 })
  systemName: string;

  @Column('varchar', { name: 'request_type', length: 255 })
  requestType: string;

  @Column({ name: 'status_code' })
  statusCode: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column('text', { name: 'error_msg' })
  errorMsg: string;

  @Column('text', { name: 'request_payload' })
  requestPayload: string;

  @Column('text', { name: 'responce_payload' })
  responcePayload: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
