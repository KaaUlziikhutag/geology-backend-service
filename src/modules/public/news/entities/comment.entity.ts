import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import PublicNews from '../news.entity';
import Worker from '../../../human-resource/member/worker/worker.entity';

@Entity('public_comments_i')
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;
  @ManyToOne(() => Worker, (worker: Worker) => worker.comments)
  @JoinColumn({ name: 'user_id' })
  workers: Worker;

  @Column()
  newsId: number;

  @Column()
  content: string;

  @ManyToOne(() => PublicNews, (news) => news.comments)
  news: PublicNews;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
