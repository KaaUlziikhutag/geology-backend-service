import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import Trees from '../tree.entity';
import Worker from '../../../../modules/human-resource/member/worker/worker.entity';
import { AbstractEntity } from '@utils/abstract.entity';

@Entity('cloud_insurance_type_i')
export default class InsuranceType extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  code: string;

  @Column('varchar', { length: 500 })
  name: string;

  @OneToMany(() => Trees, (trees: Trees) => trees.insuranceTypes)
  trees?: Trees[];

  @OneToMany(() => Worker, (worker: Worker) => worker.insurances)
  worker?: Worker[];
}
