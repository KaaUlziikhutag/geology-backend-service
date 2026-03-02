import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import Contract from '../../contract/contract.entity';
import Above from '@modules/decision/above/above.entity';

@Entity('category_organization_i')
export default class CategoryOrganization extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'com_id', nullable: true }) //Компаний id
  public comId: number;

  @Column({ name: 'author_id', nullable: true })
  public authorId: number; //  User id

  @Column({ name: 'is_individual', nullable: true })
  public isIndividual: boolean; // хувь хүн эсэх

  @Column({ name: 'is_active', nullable: true })
  public isActive: boolean; // идэхтэй эсэх

  @Column('varchar', { length: 4000, nullable: true })
  name: string; // Харилцагч байгууллага нэр

  @Column('varchar', { name: 'sur_name', length: 4000, nullable: true })
  surName: string; // Харилцагч байгууллага овог

  @Column('varchar', { length: 150, nullable: true })
  register: string; // Харилцагч байгууллага регистер

  @Column('varchar', { name: 'mail', length: 255, nullable: true })
  mail: string; // и-мэйл

  @Column('varchar', { name: 'fax', length: 255, nullable: true })
  fax: string; // факс

  @Column({ name: 'country_id', nullable: true })
  countryId: number;

  @Column({ name: 'city_id', nullable: true })
  cityId: number;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @Column('varchar', { length: 150, name: 'phone_number', nullable: true })
  phoneNumber: string; // Харилцагч байгууллага холбогдох утас

  @Column('varchar', { length: 300, nullable: true })
  note: string; //Тайлбар

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  // @OneToMany(
  //   () => Contract,
  //   (contract: Contract) => contract.categoryOrganization,
  // )
  // contracts?: Contract[];

  @OneToMany(() => Above, (above: Above) => above.categoryOrganization)
  aboves?: Above[];
}
