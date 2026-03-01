import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_human_others_soldier_i')
export default class Others extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'author_id', nullable: true })
  authorId: number;

  @Column({ name: 'worker_id', nullable: true })
  workerId: number;

  @Column({ name: 'com_id', nullable: true })
  comId: number;

  @Column({ name: 'is_solder', nullable: true })
  isSolder: number; // Цэргийн алба 'Хаагаагүй', 'Хаасан'

  @Column('varchar', { length: 300, nullable: true })
  number: string; // Цэргийн үнэмлэх дугаар

  @Column('varchar', { name: 'class_num', length: 300, nullable: true })
  classNum: string; // Цэргийн ангийн дугаар

  @Column('varchar', { name: 'soldier_app_name', length: 300, nullable: true })
  soldierAppName: string; // Алба хаасан албан тушаал

  @Column('varchar', { length: 300, nullable: true })
  occupation: string; // Бүртгүүлсэн мэргэжил

  @Column({ name: 'start_date', type: 'timestamptz', nullable: true })
  startDate: Date; //  Эхэлсэн огноо

  @Column({ name: 'end_date', type: 'timestamptz', nullable: true })
  endDate: Date; // Дууссан огноо

  @Column('varchar', { name: 'addition_info', length: 4000, nullable: true })
  additionInfo: string; // Тайлбар

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
