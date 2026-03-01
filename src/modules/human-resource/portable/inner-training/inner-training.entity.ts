import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_human_more_inner_trainings_i')
export default class Trainings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'author_id', nullable: true })
  authorId: number;

  @Column('varchar', { length: 4000, nullable: true })
  name: string;

  @Column('varchar', { name: 'covered_form', length: 4000, nullable: true })
  coveredForm: string;

  @Column('varchar', { length: 4000, nullable: true })
  course: string;

  @Column('varchar', { length: 4000, nullable: true })
  organiser: string;

  @Column({ name: 'dep_id', nullable: true })
  depId: number; // tree Id

  @Column({ name: 'app_id', nullable: true })
  appId: number; // treeId

  @Column('varchar', { name: 'dep_name', length: 255, nullable: true })
  depName: string; // Хэлтэс нэгж

  @Column('varchar', { name: 'app_name', length: 255, nullable: true })
  appName: string; // Албан тушаал

  @Column({ name: 'start_date', type: 'timestamptz', nullable: true })
  startDate: Date;

  @Column({ name: 'continued time', nullable: true })
  continuedTime: number; // Үргэлжилсэн хуцгаа

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
