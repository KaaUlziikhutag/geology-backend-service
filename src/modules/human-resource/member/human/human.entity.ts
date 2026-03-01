import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';
import { GenderType, MaritalStatus } from '../../../../utils/globalUtils';
import Worker from '../worker/worker.entity';
import { ContactDto } from './dto/contact.dto';
@Entity('human_i')
export default class Human extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column('varchar', { name: 'face_book', length: 255, nullable: true })
  faceBook: string;

  @Column({ name: 'birth_country_id', nullable: true })
  birthCountryId: number;

  @Column({ name: 'birth_city_id', nullable: true })
  birthCityId: number;

  @Column({ name: 'birth_district_id', nullable: true })
  birthDistrictId: number;

  @Column({ name: 'birth_commettee_id', nullable: true })
  birthCommetteeId: number;

  @Column({ nullable: true })
  region: number;

  @Column('varchar', {
    name: 'birth_detail_address',
    length: 4000,
    nullable: true,
  })
  birthDetailAddress: string;

  @Column({
    type: 'enum',
    enum: GenderType,
    nullable: true,
  })
  public gender: GenderType;

  @Column({ nullable: true })
  disabled: number;

  @Column('varchar', { name: 'reg_number', length: 10, nullable: true })
  regNumber: string;

  @Column('varchar', { name: 'drive_number', length: 255, nullable: true })
  driveNumber: string;

  @Column({ name: 'taxpayer_number', type: 'bigint', nullable: true })
  taxpayerNumber: string;

  @Column('varchar', { name: 'personal_mail', length: 255, nullable: true })
  personalMail: string;

  @Column('varchar', { length: 255 })
  mobile: string;

  @Column('varchar', { name: 'mobile_other', length: 255, nullable: true })
  mobileOther: string;

  @Column('varchar', { name: 'home_phone', length: 255, nullable: true })
  homePhone: string;

  @Column({ name: 'birth_date', nullable: true })
  birthDate: Date;

  @Column({ name: 'm_country_id', nullable: true })
  mcountryId: number;

  @Column({ name: 'mCity_id', nullable: true })
  mCityId: number;

  @Column({ name: 'mDistrict_id', nullable: true })
  mDistrictId: number;

  @Column({ name: 'm_commettee_id', nullable: true })
  mCommetteeId: number;

  @Column('varchar', {
    name: 'm_committee_detail_address',
    length: 4000,
    nullable: true,
  })
  mCommitteeDetailAddress: string;

  @Column({ name: 'n_country_id', nullable: true })
  ncountryId: number;

  @Column({ name: 'nCity_id', nullable: true })
  nCityId: number;

  @Column({ name: 'nDistrict_id', nullable: true })
  nDistrictId: number;

  @Column({ name: 'n_commettee_id', nullable: true })
  nCommetteeId: number;

  @Column('varchar', {
    name: 'n_committee_detail_address',
    length: 4000,
    nullable: true,
  })
  nCommitteeDetailAddress: string;

  @Column('varchar', { name: 'code_out', length: 255, nullable: true })
  codeOut: string;

  @Column({ name: 'is_hide_mobile', default: false, nullable: true })
  isHideMobile: boolean;

  @Column({
    type: 'enum',
    enum: MaritalStatus,
    nullable: true,
  })
  public married: MaritalStatus;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @Column({ type: 'jsonb', nullable: true })
  public contacts: ContactDto[]; // Холбоо барих хүний мэдээлэл

  @OneToOne(() => Worker, (worker: Worker) => worker.humans)
  public workers: Worker[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt: Date;
}
