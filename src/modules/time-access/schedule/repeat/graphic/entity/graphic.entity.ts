import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import GraphicStep from './step.entity';

@Entity('time_access_repeat_graphic_i')
export default class Graphic extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 4000, nullable: true })
  name: string; // График нэр

  @Column('varchar', { length: 4000, nullable: true })
  description: string; // График тайлбар

  @Column({ name: 'position', nullable: true }) //Position
  position: number;

  @Column({ name: 'autor_id', nullable: true }) //Author id
  autorId: number;

  @OneToMany(
    () => GraphicStep,
    (graphicStep: GraphicStep) => graphicStep.graphic,
  )
  graphicStep?: GraphicStep[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt: Date;
}
