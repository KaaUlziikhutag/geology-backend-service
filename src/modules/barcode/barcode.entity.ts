import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Barcode extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 255, unique: true })
  barcode: string;

  @Column({ type: 'boolean', default: false })
  isUsed: boolean;
}
