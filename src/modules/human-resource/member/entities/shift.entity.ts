import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_member_shift_i')
export default class WorkerShifts extends BaseEntity {
  // Шилжилт хөдөлгөөн
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'autor_id', nullable: true })
  autorId: number;

  @Column({ name: 'agree_id', nullable: true })
  agreeId: number; // ЗӨВШӨӨРСӨН

  @Column('varchar', { length: 255, nullable: true })
  reason: string; // ШАЛТГААН

  @Column('varchar', { length: 255, nullable: true })
  number: string; // тушаал

  @Column({ name: 'dep_id', nullable: true })
  depId: number;

  @Column({ name: 'app_id', nullable: true })
  appId: number;

  @Column({ name: 'com_id', nullable: true })
  comId: number;

  @Column({ nullable: true })
  type: number; // хүүхдээ харах халагдсан -1 чөлөөлөгдсөн

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
