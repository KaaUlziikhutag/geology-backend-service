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
} from 'typeorm';
import Worker from '../../../../human-resource/member/worker/worker.entity';
import IpAddress from './ip-address.entity';

@Entity('time_access_options_ip_address_byuser_k')
export default class IpAddressByusers extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ip_id', nullable: true })
  ipAddressId: number;
  @ManyToOne(
    () => IpAddress,
    (ipAddresses: IpAddress) => ipAddresses.ipAddressByusers,
  )
  @JoinColumn({ name: 'ip_id' })
  ipAddresses?: IpAddress;

  @Column({ name: 'user_id', nullable: true })
  userId: number;
  @ManyToOne(() => Worker, (workers: Worker) => workers.timeIpAddressByusers)
  @JoinColumn({ name: 'user_id' })
  workers?: Worker;

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
