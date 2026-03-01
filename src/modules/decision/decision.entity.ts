import { AbstractEntity } from '../../utils/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Company from '../company/company.entity';

/** Байгуулагын дотоод тушаал */
@Entity('decisions')
export default class Decision extends AbstractEntity {
  @Column({ name: 'company_id' })
  companyId: number;
  @JoinColumn({ name: 'company_id' })
  @ManyToOne(() => Company)
  company?: Company;

  @Column('varchar', { length: 255 })
  name: string; // тушаалын дугаар нэр

  @Column({ name: 'rule_at', type: 'date' })
  ruleAt: Date; // Мөрдөж эхлэх огноо
}
