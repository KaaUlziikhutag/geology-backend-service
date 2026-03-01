import { FileDto, MoneyType } from '../../../../utils/globalUtils';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_worker_more_socials_i')
export default class Socials extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'author_id', nullable: true })
  authorId: number;

  @Column({
    type: 'enum',
    enum: MoneyType,
    nullable: true,
  })
  public unit: MoneyType;

  @Column('varchar', { length: 40000, nullable: true })
  number: string;

  @Column('varchar', { length: 40000, nullable: true })
  type: string;

  @Column('varchar', { length: 40000, nullable: true })
  reason: string;

  @Column({ nullable: true })
  money: number;

  @Column({ type: 'jsonb', name: 'fileIds', nullable: true })
  public fileIds: FileDto[]; // FILE UPLOAD

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
