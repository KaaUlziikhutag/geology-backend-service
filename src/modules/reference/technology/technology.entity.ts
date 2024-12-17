import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** Арга */
@Entity('technologies')
export default class Technology extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { unique: true, length: 255 })
  code: string;

  @Column('varchar', { length: 255 })
  name: string;
}
