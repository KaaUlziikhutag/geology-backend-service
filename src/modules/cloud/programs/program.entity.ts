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
import Modules from '../module/modules.entity';
import { AccessType } from '@utils/enum-utils';
@Entity('cloud_programs_i')
export default class Programs extends BaseEntity {
  //Хянах самбар, хүний нөөц, Имэйл, гэрээний бүртгэл, Тушаал шиидвэр,
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100, nullable: true })
  keyword: string; // backend нэршил

  @Column('varchar', { length: 30, nullable: true })
  name: string; //backend нэршил

  @Column('varchar', { length: 100 })
  title: string; // Хүний нөөц

  @Column('text', { nullable: true })
  intro: string; // дэлгэрэнгүй

  @Column({ nullable: true })
  pos: number; // дэс дараалал байршил

  @Column({ nullable: true })
  type: number;

  @Column({ name: 'is_active', default: false })
  isActive: boolean;

  @Column({ name: 'is_mobile', default: false })
  isMobile: boolean;

  @Column({
    type: 'enum',
    enum: AccessType,
    nullable: true,
  })
  public access: AccessType;

  @OneToMany(() => Modules, (modules: Modules) => modules.program)
  modules?: Modules[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
