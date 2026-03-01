import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import IpAddressByusers from './ip-byuser.entity';

@Entity('time_access_options_ip_address_i')
export default class IpAddress extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 20, nullable: true })
  ip: string; //ip address

  @Column('varchar', { length: 500, nullable: true })
  description: string; //tailbar

  @Column({ name: 'com_id', nullable: true })
  comId: number; //Company id

  @Column({ nullable: true })
  access: number; //Хэрэглэгчийн хязгаарлалтай эсэх

  @Column({ nullable: true })
  share: number; //Private | Public

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ name: 'autor_id', nullable: true }) //Author id
  autorId: number;

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

  @OneToMany(
    () => IpAddressByusers,
    (ipAddressByusers: IpAddressByusers) => ipAddressByusers.ipAddresses,
  )
  ipAddressByusers?: IpAddressByusers[];
}
