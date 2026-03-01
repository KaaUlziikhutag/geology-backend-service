import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_worker_app_stage_byuser_k')
export default class AppStageByUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'autor_id', nullable: true })
  autorId: number;

  @Column({ name: 'app_id', nullable: true })
  appId: number;

  @Column({ name: 'stage_id', nullable: true })
  stageId: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column('varchar', { name: 'first_name', length: 800, nullable: true })
  firstName: string;

  @Column({ name: 'is_active', default: false })
  isActive: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
