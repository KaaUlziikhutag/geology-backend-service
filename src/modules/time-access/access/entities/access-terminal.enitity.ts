import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('time_access_access_terminal_i')
export default class AccessTerminal extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ip', length: 30, nullable: true })
  ip: string;

  @Column({ name: 'com_id', nullable: true })
  comId: number;

  @Column({ name: 'name', length: 256, nullable: true })
  name: string;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
