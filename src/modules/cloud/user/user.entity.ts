import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import Companies from '../company/companies.entity';
import { Device } from './user-device/user-devices.entity';

@Entity('cloud_user_i')
export default class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'worker_id', nullable: true })
  workerId: number;

  @Column({ name: 'company_id', nullable: true })
  companyId: number;
  @ManyToOne(() => Companies, (company: Companies) => company.users)
  @JoinColumn({ name: 'company_id' })
  company?: Companies;

  @Column('varchar', { name: 'first_name', length: 255, nullable: true })
  firstName: string;

  @Column('varchar', { name: 'last_name', length: 255, nullable: true })
  lastName: string;

  @Column({ type: 'varchar', length: 17, nullable: true })
  macAddress: string;

  @Column({ nullable: true })
  public profileId?: number;

  @Column({ nullable: true })
  public email: string;

  @Column('varchar', { length: 50, nullable: true })
  phoneNo: string;

  @Column({ nullable: true })
  @Exclude()
  public password?: string;

  @Column({ nullable: true })
  isActive: number;

  @Column({ default: false })
  public isEmailConfirmed: boolean;

  @Column({ nullable: true })
  public dataBase: string;

  @Column({ nullable: true })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @OneToMany(() => Device, (device) => device.user, { cascade: true })
  devices: Device[]; // Establish a one-to-many relationship with devices

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
