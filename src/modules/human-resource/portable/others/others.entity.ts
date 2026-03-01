import { ExamType } from '../../../../utils/globalUtils';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_human_others_i')
export default class Others extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'author_id', nullable: true })
  authorId: number;

  @Column({ name: 'worker_id', nullable: true })
  workerId: number;

  @Column({ name: 'com_id', nullable: true })
  comId: number;

  @Column({ name: 'is_exam', nullable: true })
  isExam: number; // Төрийн албаны шалгалт 'Өгөөгүй', 'Өгсөн'

  @Column({
    type: 'enum',
    enum: ExamType,
    nullable: true,
  })
  public examType: ExamType; // Эзэмших хэлбэр

  @Column({ nullable: true })
  score: number; // Шалгалтын оноо

  @Column({ name: 'exam_date', type: 'timestamptz', nullable: true })
  examDate: Date; // Шалгалт өгсөн огноо

  @Column('varchar', {
    name: 'addition_info_exam',
    length: 300,
    nullable: true,
  })
  additionInfoExam: string; // Тайлбар

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
