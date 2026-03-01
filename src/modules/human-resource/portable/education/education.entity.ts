import { Education, FileDto } from '../../../../utils/globalUtils';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_human_more_education_i')
export default class Educations extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'author_id', nullable: true })
  authorId: number;

  @Column('varchar', { name: 'school_name', length: 50, nullable: true })
  schoolName: string;

  @Column('varchar', { name: 'school_short_name', length: 60, nullable: true })
  schoolShortName: string;

  @Column({ name: 'country_id', nullable: true })
  countryId: number;

  @Column({ name: 'city_id', nullable: true })
  cityId: number;

  @Column({ type: 'jsonb', name: 'fileIds', nullable: true })
  public fileIds: FileDto[]; // FILE UPLOAD

  @Column({ name: 'start_year', nullable: true })
  startYear: number;

  @Column({ name: 'end_year', nullable: true })
  endYear: number;

  @Column('varchar', { length: 60, nullable: true })
  occupation: string;

  @Column({
    type: 'enum',
    enum: Education,
    nullable: true,
  })
  public education: Education;

  @Column('varchar', { length: 11, nullable: true })
  grade: string;

  @Column('varchar', { name: 'diplom_number', length: 25, nullable: true })
  diplomNumber: string;

  @Column({ name: 'is_applicant', nullable: true })
  isApplicant: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
