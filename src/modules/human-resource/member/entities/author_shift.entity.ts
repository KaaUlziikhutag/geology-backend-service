import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_member_author_shift_i')
export default class AuthorShift extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'basic_autor_id', nullable: true })
  basicAutorId: number;

  @Column({ name: 'user_id', nullable: true })
  user_id: number;

  @Column({ name: 'autor_id', nullable: true })
  autorId: number;

  @Column('varchar', { length: 255, nullable: true })
  note: string;

  @Column({ type: 'timestamptz', name: 'e_date', nullable: true })
  eDate: Date;

  @Column({ type: 'timestamptz', name: 's_date', nullable: true })
  sDate: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
