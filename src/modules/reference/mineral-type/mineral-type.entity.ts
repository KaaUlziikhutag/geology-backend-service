import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
/** Дээжийн төрөл */
@Entity('mineral_types')
export default class MineralType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255, unique: true })
  code: string;

  @Column('varchar', { length: 255 })
  name: string;
}
