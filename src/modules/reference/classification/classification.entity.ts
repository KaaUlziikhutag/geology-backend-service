import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
/** Татварын нэгдсэн ангилал */
@Entity('tax_classifications')
export default class Classification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255, unique: true })
  code: string;

  @Column('varchar', { length: 255 })
  name: string;
}
