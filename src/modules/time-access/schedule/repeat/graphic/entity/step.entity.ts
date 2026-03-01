import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import Graphic from './graphic.entity';
@Entity('time_access_repeat_graphic_step_i')
export default class GraphicStep extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'graphic_id', nullable: true })
  graphicId: number;
  @ManyToOne(() => Graphic, (graphic: Graphic) => graphic.graphicStep)
  @JoinColumn({ name: 'graphic_id' })
  graphic: Graphic;

  @Column({ name: 'duration', nullable: true }) //Duration
  public duration: number;

  @Column({ name: 'position', nullable: true }) // Position
  public position: number;

  @Column({ name: 'is_work', default: false, nullable: true })
  isWork: boolean; // Амралтын өдөр эсэх

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt: Date;
}
