import Trees from '../../../human-resource/tree/tree.entity';

import { FileDto } from '../../../../utils/globalUtils';
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
@Entity('human_resource_worker_more_description_i')
export default class Descriptions extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'author_id', nullable: true })
  authorId: number;

  @Column({ name: 'app_id', nullable: true })
  appId: number; // Албан тушаал id
  @ManyToOne(() => Trees, (tree: Trees) => tree.worker)
  @JoinColumn({ name: 'app_id' })
  appTree?: Trees;

  @Column('varchar', { length: 40000, nullable: true })
  duty: string; // Үндсэн чиг үүрэг

  @Column('varchar', { length: 40000, nullable: true })
  text: string; // дэлгэрэнгүй тайлбар

  @Column({ type: 'jsonb', name: 'fileIds', nullable: true })
  public fileIds: FileDto[]; // FILE UPLOAD

  @Column({ type: 'timestamptz', nullable: true })
  date: Date; // мөрдөж эхлэх огноо

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
