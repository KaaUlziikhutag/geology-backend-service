import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import Users from '../user/user.entity';
import Country from '../country/country.entity';

@Entity('cloud_companies_i')
export default class Companies extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'db_key', length: 30, nullable: true })
  dbKey: string;

  @Column('varchar', { length: 100, nullable: true })
  name: string;

  @Column({ nullable: true })
  public dataBase: string;

  @Column({ name: 'license_date', type: 'date', nullable: true })
  licenseDate: Date;

  @Column({ name: 'attent_date', type: 'date', nullable: true })
  attentDate: Date;

  @Column({ name: 'user_cnt', nullable: true })
  userCnt: number;

  @Column('varchar', { name: 'data_host', length: 30, nullable: true })
  dataHost: string;

  @Column('varchar', { name: 'data_dir', length: 30, nullable: true })
  dataDir: string;

  @Column('varchar', { length: 255, nullable: true })
  register: string;

  @Column({ nullable: true })
  number: number;

  @Column('varchar', { length: 255, nullable: true })
  gmail: string;

  @OneToMany(() => Users, (users: Users) => users.company)
  users?: Users[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  @Column('varchar', { name: 'merchant_tin', length: 255, nullable: true })
  ebarimtTin: string; // Баримт олгогчийн ТТД

  @Column({ name: 'province_id' })
  provinceId: number;
  @JoinColumn({ name: 'province_id' })
  @ManyToOne(() => Country)
  province?: Country;

  @Column({ name: 'district_id' })
  districtId: number;
  @JoinColumn({ name: 'district_id' })
  @ManyToOne(() => Country)
  district?: Country;

  @Column('varchar', { length: 10, nullable: true })
  phone: string;

  @Column('varchar', { length: 255, nullable: true })
  email: string;

  @Column('varchar', { name: 'address', length: 255, nullable: true })
  address: string;
}
