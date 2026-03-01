import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { JobCategory } from '../../../../utils/enumUtils';
import Worker from '../../../human-resource/member/worker/worker.entity';
import Trees from '../tree.entity';

@Entity('cloud_cccupation_i')
export default class Occupation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  mid: number; // tree Id

  @ManyToOne(() => Occupation, (occupation: Occupation) => occupation.children)
  @JoinColumn({ name: 'mid' }) // Corrected this line
  parent: Occupation;

  @Column('varchar', { length: 4000, nullable: true })
  code: string;

  @Column({
    type: 'enum',
    enum: JobCategory,
    nullable: true,
  })
  type: JobCategory;

  @Column('varchar', { length: 4000 })
  name: string;

  @OneToMany(() => Worker, (worker: Worker) => worker.occupations)
  worker?: Worker[];

  @OneToMany(() => Occupation, (occupation: Occupation) => occupation.parent)
  children: Occupation[];

  @OneToMany(() => Trees, (trees: Trees) => trees.occupations)
  tree?: Trees[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
