import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import VoteQuestion from '../vote/question/question.entity';
import Trees from '../../human-resource/tree/tree.entity';

@Entity('public_forum_i')
export default class PublicForum extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'author_id', nullable: true }) //Author id
  public authorId: number;

  @Column('int', { array: true, name: 'tree_ids', nullable: true })
  treeIds?: number[];

  @ManyToMany(() => Trees)
  @JoinTable({
    name: 'public_forum_mapping_public_news',
    joinColumn: { name: 'public_news_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tree_id', referencedColumnName: 'id' },
  })
  trees: Trees[]; // Харах эрхтэй байгууллагын бүтэц

  @Column({ type: 'text', nullable: true }) //Хэлэлцүүлэг агуулга
  body: string;

  @Column({ type: 'text', nullable: true })
  description: string; //Тайлбар

  @Column('varchar', { length: 300, nullable: true })
  youtube: string; //Youtube link

  @Column({ nullable: true })
  access: number; //Хэрэглэгчийн хязгаарлалтай эсэх

  @Column({ nullable: true })
  share: number; //Private | Public

  @Column({ name: 'is_comment_hide', default: false, nullable: true })
  public isCommentHide: boolean; //Сэтгэгдэлд нэрээ нууж болно - Comment холбох

  @Column({ type: 'timestamptz', nullable: true })
  date: Date; //Нэмсэн огноо

  @Column({ type: 'jsonb', nullable: true })
  author?: Record<string, any>;

  @OneToMany(
    () => VoteQuestion,
    (voteQuestion: VoteQuestion) => voteQuestion.publicForum,
  )
  questions: VoteQuestion[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
