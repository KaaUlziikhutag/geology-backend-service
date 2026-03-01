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
  OneToMany,
} from 'typeorm';
import PublicVote from '../vote.entity';
import VoteAnswer from '../answer/answer.entity';
import PublicForum from '../../../public/forum/forum.entity';

@Entity('public_vote_questions')
export default class VoteQuestion extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'vote_id', nullable: true }) // Санал асуулга id
  public voteId: number;
  @ManyToOne(() => PublicVote, (publicVote: PublicVote) => publicVote.questions)
  @JoinColumn({ name: 'vote_id' })
  public publicVote: PublicVote;

  @Column({ name: 'forum_id', nullable: true }) // Санал асуулга id
  public forumId: number;
  @ManyToOne(
    () => PublicForum,
    (publicForum: PublicForum) => publicForum.questions,
  )
  @JoinColumn({ name: 'forum_id' })
  public publicForum: PublicForum;

  @Column({ type: 'text', nullable: true })
  option: string; // Сонголт

  @Column({ name: 'author_id', nullable: true })
  public authorId: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  @OneToMany(
    () => VoteAnswer,
    (voteAnswer: VoteAnswer) => voteAnswer.voteQuestion,
  )
  voteAnswer: VoteAnswer[];
}
