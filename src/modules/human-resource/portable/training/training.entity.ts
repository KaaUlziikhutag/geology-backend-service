import { FileDto } from '../../../../utils/globalUtils';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_human_more_trainings_i')
export default class Trainings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'autor_id', nullable: true })
  autorId: number;

  @Column('varchar', { length: 4000, nullable: true })
  name: string;

  @Column('varchar', { length: 4000, nullable: true })
  course: string;

  @Column('varchar', { length: 255, nullable: true })
  type: string;

  @Column('varchar', { length: 4000, nullable: true })
  organiser: string;

  @Column({ name: 'country_id', nullable: true })
  countryId: number;

  @Column({ name: 'city_id', nullable: true })
  cityId: number;

  @Column({ name: 'ser_number', nullable: true })
  serNumber: number;

  @Column({ type: 'jsonb', name: 'fileIds', nullable: true })
  public fileIds: FileDto[]; // FILE UPLOAD

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
