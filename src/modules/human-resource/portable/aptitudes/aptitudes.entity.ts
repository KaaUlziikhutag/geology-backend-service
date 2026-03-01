import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_human_more_aptitudes_i')
export default class Aptitudes extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'author_Id', nullable: true })
  authorId: number;

  @Column('varchar', { name: 's_name', length: 250, nullable: true })
  sName: string;

  @Column({ name: 's_year', nullable: true })
  sYear: number;

  @Column('varchar', { length: 50, nullable: true })
  level: string;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
