import { AccessType } from '../../../utils/globalUtils';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_worker_access_i')
export default class Access extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'worker_id' })
  workerId: number; // worker id relation

  @Column({ name: 'pro_id' })
  proId: number; // cloud_programs_i id

  @Column({ name: 'mod_id', nullable: true })
  modId: number; // cloud_modules_i id

  @Column({
    type: 'enum',
    enum: AccessType,
    nullable: true,
  })
  public access: AccessType;

  @Column({ name: 'com_id' })
  comId: number; // company Id

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
  public deletedAt: Date;
}
