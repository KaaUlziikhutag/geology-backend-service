import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('shared_programs_outher')
export default class ProgramsOuter extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, name: 'com_id' })
  comId: number;

  @Column('varchar', { length: 255, nullable: true })
  name: string;

  @Column('varchar', { length: 255, nullable: true })
  intro: string;

  @Column('varchar', { length: 255, nullable: true })
  icon: string;

  @Column('varchar', { length: 255, nullable: true })
  url: string;

  @Column('varchar', { length: 255, nullable: true, name: 'public_key' })
  publicKey: string;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
