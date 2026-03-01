import Users from '../user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.devices, { onDelete: 'CASCADE' })
  user: Users;

  @Column({ type: 'varchar', name: 'device_model', length: 17, nullable: true })
  deviceModel: string;

  @Column({ type: 'varchar', length: 17, nullable: true })
  device: string;

  @Column({ type: 'varchar', name: 'os_name', length: 255, nullable: true })
  osName: string;

  @Column({ type: 'varchar', name: 'os_version', length: 255, nullable: true })
  osVersion: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  type: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  lastUsedAt: Date;
}
