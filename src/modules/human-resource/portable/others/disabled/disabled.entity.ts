import { FileDto } from '../../../../../utils/globalUtils';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_human_others_disabled_i')
export default class Disabled extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'author_id', nullable: true })
  authorId: number;

  @Column({ name: 'worker_id', nullable: true })
  workerId: number;

  @Column({ name: 'com_id', nullable: true })
  comId: number;

  @Column({ nullable: true })
  percentage: number; // хувь

  @Column('varchar', { name: 'commission_name', length: 4000, nullable: true })
  commissionName: string; // комиссын нэр

  @Column({ name: 'is_disabled', nullable: true })
  isDisabled: number; // Хөгжлийн бэрхшээртэй эсэх

  @Column({ type: 'jsonb', name: 'fileIds', nullable: true })
  public fileIds: FileDto[]; // FILE UPLOAD

  @Column('varchar', { name: 'addition_info', length: 4000, nullable: true })
  disabledInfo: string; // Тайлбар

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
