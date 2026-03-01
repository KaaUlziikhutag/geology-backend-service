import { FileDto, ItechType } from '../../../../utils/globalUtils';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_worker_more_itech_i')
export default class Itechs extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'author_id', nullable: true })
  authorId: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column('jsonb', { nullable: true, name: 'office_data' })
  public officeData: Record<string, any>;

  @Column({ type: 'jsonb', name: 'fileIds', nullable: true })
  public fileIds: FileDto[]; // FILE UPLOAD

  @Column({
    type: 'enum',
    enum: ItechType,
    nullable: true,
    name: 'itech_type',
  })
  public itechType: ItechType;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
