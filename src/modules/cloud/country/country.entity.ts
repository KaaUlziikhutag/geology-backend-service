import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CountryType } from '../../../utils/enumUtils';
@Entity('cloud_countries_i')
export default class Country extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  name: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;
  @ManyToOne(() => Country, (country: Country) => country.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Country;

  @Column({ nullable: true })
  position: number;

  @Column({ nullable: true })
  code: string;

  @Column({
    type: 'enum',
    enum: CountryType,
    default: CountryType.Country,
  })
  type: CountryType;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Country, (country: Country) => country.parent)
  children: Country[];
}
