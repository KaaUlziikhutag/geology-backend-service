import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import NewsLike from '../../shared/like/like.entity';
import { Comments } from './entities/comment.entity';
import Trees from '../../human-resource/tree/tree.entity';
@Entity('public_news_i')
export default class PublicNews extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'author_id' }) // User id
  public authorId: number;

  @Column('int', { array: true, name: 'tree_ids', nullable: true })
  treeIds?: number[];

  @ManyToMany(() => Trees)
  @JoinTable({
    name: 'user_tree_mapping_public_news',
    joinColumn: { name: 'public_news_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tree_id', referencedColumnName: 'id' },
  })
  trees: Trees[]; // Харах эрхтэй байгууллагын бүтэц

  @Column({ name: 'com_id', nullable: true }) // Group id
  public comId: number;

  @Column({ type: 'date', nullable: true })
  currentAt: Date;

  @Column('varchar', { length: 250, nullable: true })
  title: string; //Гарчиг

  @Column('varchar', { length: 500, nullable: true })
  intro: string; //Тайлбар

  @Column('varchar', { name: 'com_name', length: 500, nullable: true })
  comName: string; //Тайлбар

  @Column({ type: 'text' })
  body: string; //Агуулга

  @Column('int', { array: true, nullable: true })
  photoIds?: number[] = [];

  @Column('varchar', { length: 300, nullable: true })
  youtube: string; //Мэдээний линк

  @Column('varchar', { length: 300, nullable: true })
  folder: string; //Folder

  @Column({ type: 'jsonb', nullable: true })
  author?: Record<string, any>;

  @Column()
  status: number; //Онцлох энгийн гэх мэт төрөл 0 1

  @Column()
  access: number; //Хэрэглэгчийн хязгаарлалтай эсэх

  @Column()
  share: number; //Private | Public

  @Column({ name: 'like_count', nullable: true })
  likeCount: number; //Private | Public

  @Column({ name: 'like', nullable: true })
  like: number; // like

  @Column({ name: 'is_comment_hide', default: false, nullable: true })
  public isCommentHide: boolean; //Сэтгэгдэлд нэрээ нууж болно - Comment холбох

  @Column({ name: 'is_out', default: false, nullable: true })
  public isOut: boolean; //Hereglegehgui bol ustgah

  @OneToMany(() => Comments, (comment) => comment.news)
  comments: Comments[];

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  @OneToMany(() => NewsLike, (newsLike: NewsLike) => newsLike.publicNews)
  newsLikes: NewsLike[];
}
