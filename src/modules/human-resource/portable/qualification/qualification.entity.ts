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
@Entity('human_resource_human_more_qualification_i')
export default class Qualifications extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'author_id', nullable: true })
  authorId: number;

  @Column('varchar', { name: 'organization_name', length: 60, nullable: true })
  organizationName: string;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @Column('varchar', { length: 60, nullable: true })
  degree: string;

  @Column({ type: 'jsonb', name: 'fileIds', nullable: true })
  public fileIds: FileDto[]; // FILE UPLOAD

  @Column({ name: 'country_id', nullable: true })
  countryId: number;

  @Column({ name: 'city_id', nullable: true })
  cityId: number;

  @Column('varchar', { name: 'certificate_number', length: 60, nullable: true })
  certificateNumber: string;

  @Column({ name: 'is_applicant', nullable: true })
  isApplicant: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
