import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
/** Элемэнтийн нэгдэл */
@Entity('elements')
export default class Element extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  code: string;

  @Column('varchar', { length: 255 })
  name: string;
}
