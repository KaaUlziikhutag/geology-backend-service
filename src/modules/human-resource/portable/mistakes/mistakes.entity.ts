import { RelationIdDto } from '@utils/dto/relation-id.dto';
import { MistakesType } from '@utils/enum-utils';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_worker_more_mistakes_i')
export default class Mistakes extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'author_id', nullable: true })
  authorId: number;

  @Column({
    type: 'enum',
    enum: MistakesType,
    nullable: true,
  })
  public type: MistakesType;

  @Column({ type: 'jsonb', name: 'fileIds', nullable: true })
  public fileIds: RelationIdDto[]; // FILE UPLOAD

  @Column('varchar', { length: 4000, nullable: true })
  number: string;

  @Column('varchar', { length: 4000, nullable: true })
  mistakes: string;

  @Column('varchar', { length: 4000, nullable: true })
  reason: string;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
