import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import VoteQuestion from './question/question.entity';
import Trees from '../../human-resource/tree/tree.entity';

@Entity('public_vote_i')
export default class PublicVote extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'author_id' }) // User id
  public authorId: number;

  @Column('int', { array: true, name: 'tree_ids', nullable: true })
  treeIds?: number[];

  @ManyToMany(() => Trees)
  @JoinTable({
    name: 'public_vote_mapping_public_news',
    joinColumn: { name: 'public_news_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tree_id', referencedColumnName: 'id' },
  })
  trees: Trees[]; // Харах эрхтэй байгууллагын бүтэц

  @Column('varchar', { length: 300, nullable: true })
  title: string; //Гарчиг

  @Column('varchar', { length: 30, nullable: true })
  youtube: string; //Youtube link

  @Column({ type: 'text', nullable: true })
  exp: string; //File name system date

  @Column({ nullable: true })
  duration: number; //Үргэлжлэх хугацаа

  @Column({ nullable: true })
  access: number; //Хэрэглэгчийн хязгаарлалтай эсэх

  @Column({ nullable: true })
  share: number; //Private | Public

  @Column({ nullable: true })
  status: number; //1 хоног | 3 хоног | 7 хоног | 14 хоног

  @Column({ nullable: true })
  vote_type: number; //Нэг хариулт сонгоно | Олон хариулт сонгоно

  @Column({ name: 'is_comment_hide', default: false, nullable: true })
  public isCommentHide: boolean; //Сэтгэгдэлд нэрээ нууж болно - Comment холбох

  @Column({ type: 'timestamptz', nullable: true })
  date: Date; //Нэмсэн огноо

  @Column({ type: 'jsonb', nullable: true })
  author?: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  @OneToMany(
    () => VoteQuestion,
    (voteQuestion: VoteQuestion) => voteQuestion.publicVote,
  )
  questions: VoteQuestion[];
}
