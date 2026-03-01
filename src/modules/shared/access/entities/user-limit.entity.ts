import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('cloud_user_limit_k')
// acess
export default class UserLimit extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'item_id', nullable: true })
  itemId: number; // program_I id

  @Column({ name: 'user_id', nullable: true })
  userId: number; // program_I id

  @Column({ name: 'pro_id', nullable: true })
  proId: number; // program_I id

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
