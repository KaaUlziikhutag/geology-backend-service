import { Level, Levels } from '@utils/enum-utils';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_human_more_languages_i')
export default class Languages extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'author_id', nullable: true })
  authorId: number;

  @Column('varchar', { length: 200, nullable: true })
  name: string;

  @Column('varchar', { length: 50, nullable: true })
  exam: string;

  @Column('varchar', { length: 100, nullable: true })
  score: string;

  @Column({
    type: 'enum',
    enum: Levels,
    nullable: true,
  })
  public level: Levels;

  @Column({
    type: 'enum',
    enum: Level,
    nullable: true,
  })
  public speak: Level;

  @Column({
    type: 'enum',
    enum: Level,
    nullable: true,
  })
  public read: Level;

  @Column({
    type: 'enum',
    enum: Level,
    nullable: true,
  })
  public write: Level;

  @Column({
    type: 'enum',
    enum: Level,
    nullable: true,
  })
  public listen: Level;

  @Column('varchar', { length: 4000, nullable: true })
  note: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
