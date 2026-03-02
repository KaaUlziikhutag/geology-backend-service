import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Programs from '../programs/program.entity';
import { AccessType } from '@utils/enum-utils';
@Entity('cloud_modules_i')
// нийт ажилтан, ажлаас гарсан, амралт чөлөө авсан гэх мэт
export default class Modules extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100 })
  key: string;

  @Column({ name: 'pro_id', nullable: true })
  proId: number; // program_I id
  @ManyToOne(() => Programs, (program: Programs) => program.modules)
  @JoinColumn({ name: 'pro_id' })
  program?: Programs;

  @Column('varchar', { length: 30, nullable: true })
  name: string;

  @Column('varchar', { length: 100, nullable: true })
  title: string;

  @Column('varchar', { length: 300, nullable: true })
  comment: string;

  @Column({ nullable: true })
  pos: number;

  @Column({
    type: 'enum',
    enum: AccessType,
    nullable: true,
  })
  public access: AccessType;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
