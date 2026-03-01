import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_worker_applicant_i')
export default class Applicants extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'db_key', nullable: true })
  dbKey: string;

  @Column({ name: 'com_id', nullable: true })
  comId: number;

  @Column('varchar', { name: 'com_name', nullable: true })
  comName: string;

  @Column({ name: 'app_id', nullable: true })
  appId: number;

  @Column('varchar', { name: 'family_name', length: 255, nullable: true })
  familyName: string;

  @Column('varchar', { name: 'first_name', length: 255, nullable: true })
  firstName: string;

  @Column('varchar', { name: 'last_name', length: 255, nullable: true })
  lastName: string;

  @Column('varchar', { length: 255, nullable: true })
  nation: string;

  @Column('varchar', { name: 'social_origin', length: 255, nullable: true })
  socialOrigin: string;

  @Column('varchar', { name: 'birth_country', length: 255, nullable: true })
  birthCountry: string;

  @Column('varchar', { name: 'birth_city', length: 255, nullable: true })
  birthCity: string;

  @Column('varchar', { name: 'birth_district', length: 255, nullable: true })
  birthDistrict: string;

  @Column('varchar', { name: 'birth_committee', length: 255, nullable: true })
  birthCommittee: string;

  @Column('varchar', { length: 255, nullable: true })
  photo: string;

  @Column({ nullable: true })
  gender: number;

  @Column('varchar', { name: 'reg_number', length: 10, unique: true })
  regNumber: string;

  @Column('varchar', { name: 'nd_number', length: 12 })
  ndNumber: string;

  @Column('varchar', { name: 'drive_number', length: 255, nullable: true })
  driveNumber: string;

  @Column('varchar', { name: 'personal_mail', length: 255, nullable: true })
  personalMail: string;

  @Column('varchar', { length: 255 })
  mobile: string;

  @Column('varchar', { name: 'mobile_other', length: 255, nullable: true })
  mobileOther: string;

  @Column('varchar', { name: 'home_phone', length: 255, nullable: true })
  homePhone: string;

  @Column({ name: 'birth_date', type: 'timestamptz', nullable: true })
  birthDate: Date;

  @Column('varchar', { name: 'm_country', length: 255, nullable: true })
  mCountry: string;

  @Column('varchar', { name: 'm_city', length: 255, nullable: true })
  mCity: string;

  @Column('varchar', { name: 'm_district', length: 255, nullable: true })
  mDistrict: string;

  @Column('varchar', { name: 'n_country', length: 255, nullable: true })
  nCountry: string;

  @Column('varchar', { name: 'n_city', length: 255, nullable: true })
  nCity: string;

  @Column('varchar', { name: 'n_district', length: 255, nullable: true })
  nDistrict: string;

  @Column('varchar', { name: 'n_committee', length: 255, nullable: true })
  nCommittee: string;

  @Column('varchar', { name: 'n_region', length: 255, nullable: true })
  nRegion: string;

  @Column('varchar', { name: 'n_street', length: 255, nullable: true })
  nStreet: string;

  @Column('varchar', { name: 'n_number', length: 255, nullable: true })
  nNumber: string;

  @Column({ name: 'is_applicant', default: false })
  isApplicant: boolean;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
