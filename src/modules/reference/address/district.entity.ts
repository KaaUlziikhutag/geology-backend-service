import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Province from './province.entity';

@Entity('districts')
export default class District extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'province_id' })
  provinceId: number;
  @JoinColumn({ name: 'province_id' })
  @ManyToOne(() => Province)
  province?: Province;

  @Column('varchar', { length: 255 })
  code: string;

  @Column('varchar', { length: 255 })
  name: string;
}
