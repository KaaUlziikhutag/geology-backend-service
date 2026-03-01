import { Homes, MineType } from '../../../../../utils/globalUtils';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_human_others_home_i')
export default class Others extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'author_id', nullable: true })
  authorId: number;

  @Column({ name: 'worker_id', nullable: true })
  workerId: number;

  @Column({ name: 'com_id', nullable: true })
  comId: number;

  @Column({
    type: 'enum',
    enum: Homes,
    nullable: true,
  })
  public home: Homes; // Орон байр

  @Column({
    type: 'enum',
    enum: MineType,
    nullable: true,
  })
  public mineType: MineType; // Эзэмших хэлбэр

  @Column('varchar', {
    name: 'addition_info_home',
    length: 300,
    nullable: true,
  })
  additionInfoHome: string; // Тайлбар

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
