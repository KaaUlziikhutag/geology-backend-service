import { FileDto } from '../../../utils/globalUtils';
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
import PublicViewUser from '../view-users/view-users.entity';

@Entity('public_gallery_i')
export default class PublicGallery extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'author_id', nullable: true })
  public authorId: number;

  @Column('int', { array: true, name: 'view_user_ids', nullable: true })
  viewUserIds?: number[];

  @Column('varchar', { length: 300, nullable: true })
  exp: string; //File name system date

  @Column('varchar', { length: 300, nullable: true })
  small: string; //Small picture

  @Column('varchar', { length: 300, nullable: true })
  large: string; //Large picture

  @Column({ nullable: true })
  access: number; //Хэрэглэгчийн хязгаарлалтай эсэх

  @Column({ type: 'jsonb', name: 'fileIds', nullable: true })
  public fileIds: FileDto[]; // FILE UPLOAD

  @Column({ nullable: true })
  share: number; //Private | Public

  @Column({ name: 'is_comment_hide', default: false, nullable: true })
  public isCommentHide: boolean; //Сэтгэгдэлд нэрээ нууж болно - Comment холбох

  @OneToMany(
    () => PublicViewUser,
    (viewUser: PublicViewUser) => viewUser.publicGallery,
    { onUpdate: 'CASCADE' },
  )
  public viewUsers: PublicViewUser[]; // Гэрээ харах хэрэглэгчид

  @Column({ name: 'is_favourite', default: false, nullable: true })
  public isFavourite: boolean; // Одтой эсэх

  @Column({ name: 'is_deleted', default: false, nullable: true })
  public isDeleted: boolean; // Устгасан

  @Column({ type: 'timestamptz', nullable: true })
  date: Date; //Нэмсэн огноо

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
