import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('shared_programs_bycom_k')
export default class ProgramsBycom extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, name: 'pro_id' })
  proId: number;

  @Column({ nullable: true, name: 'com_id' })
  comId: number;

  @Column({ name: 'is_active', default: false, nullable: true })
  isActive: boolean;

  @Column({ name: 'is_init', default: false, nullable: true })
  isInit: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
