import {
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  Relation,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../../utils/enum-utils.js';
import LocalFile from '../local-files/local-file.entity.js';
import Company from '../company/company.entity.js';
import Laboratory from '../reference/laboratory/laboratory.entity.js';
import Order from '../order/order.entity.js';
import Task from '../task/task.entity.js';
@Entity('cloud_user_i')
class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'company_id' })
  companyId: number;
  // @JoinColumn({ name: 'company_id' })
  // @ManyToOne(() => Company)
  // company?: Company;

  @Column({ name: 'laboratory_id', nullable: true })
  laboratoryId: number;
  // @JoinColumn({ name: 'laboratory_id' })
  // @ManyToOne(() => Laboratory)
  // laboratory?: Laboratory;

  @Column('varchar', { name: 'first_name', length: 50, nullable: true })
  firstName: string;

  @Column('varchar', { name: 'last_name', length: 50, nullable: true })
  lastName: string;

  @Column('varchar', { name: 'username', length: 255, nullable: true })
  username: string;

  @Column({ unique: true, length: 255, nullable: true })
  email: string;

  @Column('varchar', { unique: true, length: 20, nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @Column({ name: 'is_active', type: 'boolean', default: false })
  isActive: boolean;

  @Column({ name: 'avatar_id', nullable: true })
  avatarId?: number;
  // @JoinColumn({ name: 'avatar_id' })
  // @ManyToOne(() => LocalFile, {
  //   nullable: true,
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // avatar?: LocalFile;

  @Column({ nullable: true })
  @Exclude()
  password?: string;

  @Column('text', { nullable: true })
  address: string;

  @Column({
    name: 'current_hashed_refresh_token',
    nullable: true,
  })
  @Exclude()
  currentHashedRefreshToken?: string;

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
}

export default Users;
