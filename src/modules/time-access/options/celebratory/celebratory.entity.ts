import { TimeCelebratoryType } from '../../../../utils/globalUtils';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('time_access_options_celebratory_i')
export default class Celebratory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'is_celebratory', default: false })
  isCelebratory: boolean; // Тэмдэглэлт өдөр нь тогтмол эсэх

  @Column({
    type: 'enum',
    enum: TimeCelebratoryType,
    nullable: true,
  })
  public type: TimeCelebratoryType; // Төрөл

  @Column('varchar', { length: 4000, nullable: true })
  name: string; // Баярын нэр

  @Column({ name: 'com_id', nullable: true })
  comId: number; // Company id

  @Column({ name: 'start_date', nullable: true })
  startDate: Date; // Эхлэх огноо

  @Column({ name: 'end_date', nullable: true })
  endDate: Date; // Эхлэх огноо

  @Column({ nullable: true })
  duration: number; // Үргэлжлэх хоног

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
