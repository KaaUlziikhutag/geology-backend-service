import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Citizen } from '../../citizen/entities/citizen.entity';
import { Organization } from './organization.entity';
import { AbstractEntity } from '@utils/abstract.entity';

@Entity('organization_citizens')
export class OrganizationCitizen extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'citizen_id' })
  citizenId: number;
  @JoinColumn({ name: 'citizen_id' })
  @ManyToOne(() => Citizen, (citizen) => citizen.organizations, {
    onDelete: 'CASCADE',
  })
  citizen: Citizen;

  @Column({ name: 'organization_id' })
  organizationId: number;
  @JoinColumn({ name: 'organization_id' })
  @ManyToOne(() => Organization, (org) => org.citizens, { onDelete: 'CASCADE' })
  organization: Organization;

  @Column('varchar', { length: 255, nullable: true })
  role: string; // Иргэний байр суурь (ажилтан, оюутан, гишүүн, эмчлүүлэгч...)

  @Column('date', { nullable: true })
  startDate: Date; // Холбоо эхэлсэн огноо

  @Column('date', { nullable: true })
  endDate: Date; // Холбоо дууссан огноо

  @Column('boolean', { default: false })
  allowOrgAccess: boolean;
  // true бол байгууллага тухайн иргэний хувийн мэдээлэл (нэр, РД, холбоо барих) үзнэ

  @Column('boolean', { default: false })
  allowCitizenAccess: boolean;
  // true бол иргэн байгууллагын талаарх нарийн мэдээлэл (бүртгэлтэй ажилтан, үйлчилгээний түүх) үзнэ
}
