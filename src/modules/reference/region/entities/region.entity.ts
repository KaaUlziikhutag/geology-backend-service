import { AbstractEntity } from '@utils/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RegionLevel } from '../region.enums';
/** Хаяг бүсчлэлийн мэдээлэл */
@Entity('ref_regions')
export default class Region extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'parent_id', nullable: true })
  parentId: number;
  @ManyToOne(() => Region, (region) => region.children, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent?: Region;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { length: 255, nullable: true })
  code: string; // Улсын/аймгийн код

  @Column('int', { default: 0 })
  position: number; // Жагсаалтын эрэмбэ

  @Column({ type: 'enum', enum: RegionLevel, nullable: true })
  level: RegionLevel;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  lat: number; // Өргөрөг

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  long: number; // Уртраг

  @OneToMany(() => Region, (region) => region.parent)
  children: Region[];
}
