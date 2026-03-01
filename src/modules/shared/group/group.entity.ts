import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('shared_group_i')
export default class Groups extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  mid: number;

  @Column({ name: 'autor_id', nullable: true })
  autorId: number;

  @Column('varchar', { length: 255, nullable: true })
  name: string;

  @Column('varchar', { length: 255, nullable: true })
  note: string;

  @Column({ nullable: true })
  pos: number;

  @Column({ nullable: true })
  color: number;

  @Column({ nullable: true })
  child: number;

  @Column({ nullable: true })
  rows: number;

  @Column({ name: 'com_id', nullable: true })
  comId: number;

  @Column({ nullable: true })
  access: number;

  @Column({ nullable: true })
  share: number;

  @Column('varchar', { length: 255, nullable: true })
  pro: string;

  @Column('varchar', { length: 255, nullable: true })
  mod: string;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
