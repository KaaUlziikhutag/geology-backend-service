import Inner from '../../../decision/inner/inner.entity';
import { DecisionCategory, DecisionType } from '../../../../utils/globalUtils';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import Above from '../../../decision/above/above.entity';

@Entity('decision_type_i')
export default class Type extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'com_id', nullable: true })
  public comId: number;

  @Column({ name: 'author_id', nullable: true })
  public authorId: number;

  @Column('varchar', { length: 150, nullable: true })
  name: string; // Бичгийн төрлийн нэр

  @Column('varchar', { length: 300, nullable: true })
  note: string;

  @Column({
    type: 'enum',
    enum: DecisionCategory,
    name: 'writing_category',
    nullable: true,
  })
  public writingCategory: DecisionCategory; // модуль

  @Column({
    type: 'enum',
    enum: DecisionType,
    nullable: true,
  })
  public decisionType: DecisionType; // модуль

  @OneToMany(() => Inner, (inner: Inner) => inner.types)
  inner?: Inner[];

  @OneToMany(() => Above, (above: Above) => above.types)
  above?: Above[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
