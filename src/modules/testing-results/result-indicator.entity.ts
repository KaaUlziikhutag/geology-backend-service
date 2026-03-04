import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Indicator from '../indicator/indicator.entity';
import TestingResult from './testing-result.entity';
/** үр дүнгийн үзүүлэлт */
@Entity('result_indicators')
export default class ResultIndicator extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'result_id' })
  resultId: number;
  @JoinColumn({ name: 'result_id' })
  @ManyToOne(() => TestingResult, (result) => result.resultIndicators)
  result?: TestingResult;

  @Column({ name: 'indicator_id' })
  indicatorId: number;
  @JoinColumn({ name: 'indicator_id' })
  @ManyToOne(() => Indicator)
  indicator?: Indicator;

  @Column({ type: 'float' })
  value: number;
}
