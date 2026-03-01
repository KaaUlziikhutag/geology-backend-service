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
import Trees from '../tree.entity';
import Worker from '../../../../modules/human-resource/member/worker/worker.entity';

@Entity('cloud_insurance_type_i')
export default class InsuranceType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  code: string;

  @Column('varchar', { length: 4000 })
  type: string;

  @OneToMany(() => Trees, (trees: Trees) => trees.insuranceTypes)
  trees?: Trees[];

  @OneToMany(() => Worker, (worker: Worker) => worker.insurances)
  worker?: Worker[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
