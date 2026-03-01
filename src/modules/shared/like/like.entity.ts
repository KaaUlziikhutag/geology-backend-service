import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import PublicNews from '../../public/news/news.entity';
import Worker from '../../human-resource/member/worker/worker.entity';

@Entity('public_news_like')
export default class NewsLike extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'news_id', nullable: true }) // Санал асуулга id
  public newsId: number;
  @ManyToOne(() => PublicNews, (publicNews: PublicNews) => publicNews.newsLikes)
  @JoinColumn({ name: 'news_id' })
  public publicNews: PublicNews;

  @Column({ name: 'user_id', nullable: true }) // User id
  public userId: number;
  @ManyToOne(() => Worker, (worker: Worker) => worker.newsLikes)
  @JoinColumn({ name: 'user_id' })
  workers: Worker;

  @Column({ name: 'is_liked', default: false, nullable: true })
  public isLiked: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
