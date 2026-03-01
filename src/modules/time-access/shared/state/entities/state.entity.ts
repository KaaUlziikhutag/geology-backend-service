import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('time_access_shared_state_i') // Цаг бүртгэлийн хүсэлтийн төлөв
export default class State extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'author_id', nullable: true }) //Нэмсэн хүний id
  public authorId: number;

  @Column('varchar', { name: 'start_time', nullable: true })
  type: number; //Төрөл

  @Column('varchar', { name: 'note', nullable: true })
  note: string; //Тайлбар

  @Column({ name: 'is_salary', default: false })
  isSalary: boolean; //Цалинтай эсэх

  @Column({ nullable: true })
  skip_weekend: number; //Амралтын өдөр алгасах

  @Column({ nullable: true })
  diff_days: number; //Торгох мөнгө

  @Column({ nullable: true })
  set_time_mor: number;

  @Column({ nullable: true })
  set_time_morEnd: number;

  @Column({ nullable: true })
  set_time_even: number;

  @Column({ nullable: true })
  set_time_evenStart: number;

  @Column({ name: 'request_id', nullable: true })
  requestId: number; //Цаг бүртгэлийн хүсэлт

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
