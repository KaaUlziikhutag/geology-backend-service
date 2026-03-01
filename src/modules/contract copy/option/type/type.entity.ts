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
import Contract from '../../contract.entity';
import { ContractType } from '../../../../utils/globalUtils';

@Entity('contract_type_i')
export default class Type extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'com_id', nullable: true }) //Компаний id
  public comId: number;

  @Column({ name: 'author_id', nullable: true }) //Нэмсэн хэрэглэгч
  public authorId: number;

  @Column('varchar', { length: 150, nullable: true })
  name: string; //Төрлийн нэр

  @Column('varchar', { length: 150, nullable: true })
  code: string; //Төрлийн нэр

  @Column('varchar', { length: 300, nullable: true })
  note: string; //Тайлбар

  @Column({
    type: 'enum',
    enum: ContractType,
    nullable: true,
  })
  public contractType: ContractType;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt: Date;

  @OneToMany(() => Contract, (contract: Contract) => contract.type)
  contracts?: Contract[];
}
