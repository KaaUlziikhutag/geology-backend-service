import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
/** Захиалагчийн үйл ажилгааны чиглэл */
@Entity('customer_directions')
export class Direction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255, unique: true })
  code: string;

  @Column('varchar', { length: 255 })
  name: string;
}
