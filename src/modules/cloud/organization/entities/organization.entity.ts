import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrganizationCitizen } from './organization-citizen';
import { AbstractEntity } from '@utils/abstract.entity';

@Entity('organizations')
export class Organization extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  name: string; // Байгууллагын нэр

  @Column('varchar', { unique: true, length: 255, nullable: true })
  regno: string; // Байгууллагын регистр

  @Column('varchar', { length: 255, nullable: true })
  type: string; // Төрөл (компан, ТББ, сургууль, эмнэлэг, төрийн байгууллага...)

  @Column('varchar', { length: 500, nullable: true })
  address: string; // Хаяг

  @Column('varchar', { length: 20, nullable: true })
  phone: string; // Утас

  @Column('varchar', { length: 255, nullable: true })
  email: string; // Имэйл

  @Column('varchar', { length: 255, nullable: true })
  website: string; // Вэб сайт

  @OneToMany(() => OrganizationCitizen, (relation) => relation.organization)
  citizens: OrganizationCitizen[];
}
