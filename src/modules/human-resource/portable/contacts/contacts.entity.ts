import {
  ContactPersonStatus,
  JobTypeStatus,
} from '../../../../utils/enumUtils';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_human_more_contacts_i')
export default class Contacts extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'author_id', nullable: true })
  authorId: number;

  @Column('varchar', { name: 'last_name', length: 250, nullable: true })
  lastName: string;

  @Column('varchar', { name: 'first_name', length: 250, nullable: true })
  firstName: string;

  @Column({ name: 'birth_date', type: 'timestamptz', nullable: true })
  birthDate: Date;

  @Column({
    nullable: true,
    type: 'enum',
    name: 'who_is',
    enum: ContactPersonStatus,
  })
  public whoIs: ContactPersonStatus;

  @Column({
    nullable: true,
    type: 'enum',
    name: 'job_type',
    enum: JobTypeStatus,
  })
  public jobType: JobTypeStatus;

  @Column('varchar', { length: 100, nullable: true })
  workplace: string;

  @Column('varchar', { length: 250, nullable: true })
  work: string;

  // @Column('varchar', { length: 4000, nullable: true })
  // profession: string;

  @Column('varchar', { length: 250, nullable: true })
  phone: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
