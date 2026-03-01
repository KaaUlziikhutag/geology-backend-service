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
import VoteQuestion from '../question/question.entity';

@Entity('public_vote_question_answer')
export default class VoteAnswer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'question_id', nullable: true }) // Санал асуулга id
  public questionId: number;
  @ManyToOne(
    () => VoteQuestion,
    (voteQuestion: VoteQuestion) => voteQuestion.voteAnswer,
  )
  @JoinColumn({ name: 'question_id' })
  public voteQuestion: VoteQuestion;

  @Column({ name: 'user_id', nullable: true }) // User id
  public userId: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
