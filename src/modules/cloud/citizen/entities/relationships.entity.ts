import { AbstractEntity } from '@utils/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Citizen } from './citizen.entity';

@Entity('citizen_relationships')
export class CitizenRelationship extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'citizen_id' })
  citizenId: number;
  @JoinColumn({ name: 'citizen_id' })
  @ManyToOne(() => Citizen, { onDelete: 'CASCADE' })
  citizen: Citizen; // Иргэн А

  @Column({ name: 'related_citizen_id' })
  relatedCitizenId: number;
  @JoinColumn({ name: 'related_citizen_id' })
  @ManyToOne(() => Citizen, { onDelete: 'CASCADE' })
  relatedCitizen: Citizen; // Иргэн Б

  @Column('varchar', { length: 100 })
  relationshipType: string;
}
