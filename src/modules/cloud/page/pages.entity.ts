import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('cloud_pages_i')
export default class Pages extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255, nullable: true })
  pro: string;

  @Column('varchar', { length: 255, nullable: true })
  mod: string;

  @Column('varchar', { length: 255, nullable: true })
  tab: string;

  @Column('varchar', { length: 255, nullable: true })
  key: string;

  @Column('varchar', { length: 500, nullable: true })
  name: string;

  @Column('varchar', { length: 500, nullable: true })
  search: string;

  @Column({ nullable: true })
  pos: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
