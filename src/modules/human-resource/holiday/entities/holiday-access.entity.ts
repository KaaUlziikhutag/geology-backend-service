import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_holiday_access_i')
export default class HolidayAccess extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, name: 'user_id' })
  userId: number;

  @Column({ nullable: true, name: 'com_id' })
  comId: number;

  @Column({ name: 'is_overview', default: false, nullable: true })
  isOverview: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
