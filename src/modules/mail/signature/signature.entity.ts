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
import SignatureViewUser from './view-users/view-users.entity';
import { FileDto } from '../../../utils/globalUtils';

@Entity('mail_signature_i')
export default class Signature extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'author_id', nullable: true })
  public authorId: number; //Нэмсэн хүн

  @Column({ name: 'com_id', nullable: true })
  public comId: number; //Байгууллага id

  @Column('varchar', { length: 7, nullable: true })
  pos: string; //байрлал

  @Column('varchar', { length: 300, nullable: true })
  name: string; //Гарын үсэг нэр

  @Column({ type: 'text', nullable: true })
  body: string; //Гарын үсэг агуулга

  @Column({ nullable: true })
  access: number; //Хэрэглэгчийн хязгаарлалтай эсэх

  @Column({ nullable: true })
  share: number; ////Private | Public

  @Column({ type: 'timestamptz', nullable: true })
  date: Date; //Огноо

  @Column({ type: 'jsonb', name: 'fileIds', nullable: true })
  public fileIds: FileDto[]; // FILE UPLOAD

  @Column({ name: 'is_standart', default: false, nullable: true })
  public isStandart: boolean; //Стандарт гарын үсэг эсэх

  @Column({ name: 'is_green_tree', default: false, nullable: true })
  public isGreenTree: boolean; //Ногоон навч эсэх

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  @OneToMany(
    () => SignatureViewUser,
    (viewUser: SignatureViewUser) => viewUser.signature,
    { onUpdate: 'CASCADE' },
  )
  public viewUsers: SignatureViewUser[]; // Гарын үсгийн харах хэрэглэгчид
}
