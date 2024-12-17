import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
/** Хэмжих нэгжүүд */
@Entity('measurements')
export default class Measurement extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;
}
