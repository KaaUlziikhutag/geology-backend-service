import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
/** Лаборатори */
@Entity('laboratories')
export default class Laboratory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255, unique: true })
  code: string;

  @Column('varchar', { length: 255 })
  name: string;
}
