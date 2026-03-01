import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Contract from '../contract.entity';
import Worker from '../../human-resource/member/worker/worker.entity';

@Entity('contract_delegate_our')
export default class ContractDelegateOur extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'contract_id' }) //Гэрээний id
  public contractId: number;
  @ManyToOne(() => Contract, (contract: Contract) => contract.delegateOur, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'contract_id' })
  public contract: Contract;

  @Column({ name: 'delegate_id' }) //user Id
  public delegateId: number;
  @ManyToOne(() => Worker, (worker: Worker) => worker.contractDelegateOur)
  @JoinColumn({ name: 'delegate_id' })
  public worker?: Worker;
}
