import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Province from '../reference/address/province.entity';
import District from '../reference/address/district.entity';

@Entity('companies')
export default class Company extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'logo_id' })
  logoId: number;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { name: 'regno', length: 255, nullable: true })
  regno: string;

  @Column('varchar', { name: 'merchant_tin', length: 255, nullable: true })
  ebarimtTin: string; // Баримт олгогчийн ТТД

  @Column('varchar', { length: 10, nullable: true })
  phone: string;

  @Column('varchar', { length: 255, nullable: true })
  email: string;

  @Column({ name: 'province_id' })
  provinceId: number;
  @JoinColumn({ name: 'province_id' })
  @ManyToOne(() => Province)
  province?: Province;

  @Column({ name: 'district_id' })
  districtId: number;
  @JoinColumn({ name: 'district_id' })
  @ManyToOne(() => District)
  district?: District;

  @Column('varchar', { name: 'address', length: 255, nullable: true })
  address: string;
}
