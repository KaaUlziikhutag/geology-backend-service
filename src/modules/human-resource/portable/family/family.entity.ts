import {
  ContactPersonStatus,
  JobTypeStatus,
} from '../../../../utils/enumUtils';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_human_more_family_i')
export default class Families extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'author_id', nullable: true })
  authorId: number;

  @Column({
    nullable: true,
    type: 'enum',
    name: 'who_is',
    enum: ContactPersonStatus,
  })
  public whoIs: ContactPersonStatus;

  @Column('varchar', { name: 'l_name', length: 300, nullable: true })
  lName: string;

  @Column('varchar', { name: 'f_name', length: 300, nullable: true })
  fName: string;

  @Column({
    nullable: true,
    type: 'enum',
    name: 'job_type',
    enum: JobTypeStatus,
  })
  public jobType: JobTypeStatus;

  @Column('varchar', { length: 300, nullable: true })
  desc: string;

  @Column('varchar', { name: 'job_name', length: 300, nullable: true })
  jobName: string;

  @Column('varchar', { length: 300, nullable: true })
  phone: string;

  @Column('varchar', { length: 300, nullable: true })
  occupation: string;

  @Column({ name: 'birth_date', type: 'timestamptz', nullable: true })
  birthDate: Date;

  @Column({ name: 'birth_country', nullable: true })
  birthCountryId: number;

  @Column({ name: 'birth_city', nullable: true })
  birthCityId: number;

  @Column({ name: 'birth_district', nullable: true })
  birthDistrictId: number;

  @Column({ name: 'live_country', nullable: true })
  liveCountryId: number;

  @Column({ name: 'live_city', nullable: true })
  liveCityId: number;

  @Column({ name: 'live_district', nullable: true })
  liveDistrictId: number;

  @Column('varchar', {
    name: 'detail_address',
    length: 4000,
    nullable: true,
  })
  detailAddress: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
