import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CitizenRelationship } from './relationships.entity';
import { Expose } from 'class-transformer';
import { GenderType } from '@utils/enum-utils';
import Users from '@modules/users/users.entity';
import { AbstractEntity } from '@utils/abstract.entity';
import { OrganizationCitizen } from '@modules/cloud/organization/entities/organization-citizen';

@Entity('citizens')
export class Citizen extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255, nullable: true })
  nationality: string; // Иргэншил

  @Column('varchar', { length: 255, nullable: true })
  ethnicity: string; // Яс үндэс

  @Column('varchar', { name: 'clan', length: 255, nullable: true })
  clan: string; // Ургийн овог

  @Column('varchar', { length: 255, nullable: true })
  lastname: string; // Овог

  @Column('varchar', { length: 255, nullable: true })
  firstname: string; // Нэр

  @Column('varchar', { unique: true, length: 255, nullable: true })
  regno: string; // РД

  @Column('date', { nullable: true })
  birthday: Date; // Төрсөн өдөр

  @Column('enum', { enum: GenderType, default: GenderType.Woman })
  gender: string; // Хүйс

  @Column('varchar', { length: 255, nullable: true })
  birthPlace: string; // Төрсөн газар

  @Column({ type: 'boolean', nullable: true })
  disabled: boolean; // Хөгжлийн бэрхшээлтэй эсэх

  @Column('varchar', { length: 20, nullable: true })
  phone: string; // Утас

  @Column('varchar', { name: 'home_phone', length: 255, nullable: true })
  homePhone: string; // Гэрийн утас

  @Column('varchar', { length: 255, nullable: true })
  email: string; // Имэйл

  @Column('varchar', { length: 255, nullable: true })
  occupation: string; // Мэргэжил / ажил эрхлэлт

  @Column('varchar', { length: 255, nullable: true })
  education: string; // Боловсролын түвшин

  @Column('varchar', { name: 'driven_lisence_no', length: 255, nullable: true })
  drivenLisenseNo: string; // Жолооны үнэмлэхний дугаар

  @Column('varchar', { name: 'ebarimt_no', length: 100, nullable: true })
  ebarimtNo: string;

  @Column({ name: 'province_id', nullable: true })
  provinceId: number; // Оршин суугаа аймаг

  @Column({ name: 'district_id', nullable: true })
  districtId: number; // Оршин суугаа сум, дүүрэг

  @Column({ name: 'street_id', nullable: true })
  streetId: number; // Оршин суугаа сум, дүүрэг

  @Column('varchar', { length: 500, nullable: true })
  address: string; // Оршин суугаа хаяг

  @Expose()
  get age(): number {
    const currentYear = new Date().getFullYear();
    return currentYear - this.birthday.getFullYear();
  }

  @Expose()
  get isChild(): boolean {
    return this.age < 19 ? true : false;
  }

  @Column({ name: 'user_id', nullable: true })
  userId: number;
  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => Users)
  user: Users; // , (user) => user.profile

  @OneToMany(() => CitizenRelationship, (relation) => relation.citizen)
  relationships: CitizenRelationship[];

  @OneToMany(() => CitizenRelationship, (relation) => relation.relatedCitizen)
  relatedTo: CitizenRelationship[];

  @OneToMany(() => OrganizationCitizen, (relation) => relation.citizen)
  organizations: OrganizationCitizen[];
}
