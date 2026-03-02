import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Contract from '../contract.entity';

@Entity('contract_delegate_out')
export default class ContractDelegateOut extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'contract_id' }) //Гэрээний id
  public contractId: number;
  @ManyToOne(() => Contract, (contract: Contract) => contract.delegateOut, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'contract_id' })
  public contract: Contract;

  @Column('varchar', { name: 'delegate_name', length: 300, nullable: true })
  delegateName: string; //Төлөөлөгчийн нэр
}
