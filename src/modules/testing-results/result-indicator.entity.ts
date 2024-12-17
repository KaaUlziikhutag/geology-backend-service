import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import Indicator from '../indicator/indicator.entity.js';
import TestingResult from './testing-result.entity.js';
/** үр дүнгийн үзүүлэлт */
@Entity('result_indicators')
export default class ResultIndicator extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'result_id' })
  resultId: number;
  @JoinColumn({ name: 'result_id' })
  @ManyToOne(() => TestingResult, (result) => result.resultIndicators)
  result?: Relation<TestingResult>;

  @Column({ name: 'indicator_id' })
  indicatorId: number;
  @JoinColumn({ name: 'indicator_id' })
  @ManyToOne(() => Indicator)
  indicator?: Indicator;

  @Column({ type: 'float' })
  value: number;
}
