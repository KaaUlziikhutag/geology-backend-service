import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_appointment_close_i')
export default class AppointmentCloses extends BaseEntity {
  //цуцалсан
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'item_id', nullable: true })
  itemId: number;

  @Column('varchar', { nullable: true })
  note: string; // string, Тайлбар

  @Column({ name: 'decision_num', nullable: true })
  decisionNum: number;

  @Column({ type: 'timestamptz', nullable: true })
  fdate: Date;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
