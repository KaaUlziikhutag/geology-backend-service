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
import EmploymentContract from '../option/employment/employment.entity';

@Entity('contract_view_users')
export default class ContractViewUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'contract_id', nullable: true }) // Гэрээний id
  public contractId: number;
  @ManyToOne(() => Contract, (contract: Contract) => contract.viewUsers, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'contract_id' })
  public contract: Contract;

  @Column({ name: 'employment_id', nullable: true }) // Гэрээний id
  public employmentId: number;
  @ManyToOne(
    () => EmploymentContract,
    (employmentContract: EmploymentContract) => employmentContract.viewUsers,
    {
      nullable: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'employment_id' })
  public employmentContract: EmploymentContract;

  @Column({ name: 'user_id' }) //Хэрэглэгчийн id
  public userId: number;
  // @ManyToOne(() => Worker, (worker: Worker) => worker.viewUsers)
  // @JoinColumn({ name: 'user_id' })
  // public worker?: Worker;
}
