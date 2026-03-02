import { FileType } from '@utils/enum-utils';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import PublicViewUser from '../view-users/view-users.entity';
import LocalFile from '@modules/local-files/local-file.entity';

@Entity('public_files_i')
export default class PublicFiles extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'author_id', nullable: true }) //Author id User id
  public authorId: number;

  @Column({ name: 'mid', nullable: true }) // Folder дотор агуулагдана
  public mid: number;
  @ManyToOne(
    () => PublicFiles,
    (publicFiles: PublicFiles) => publicFiles.children,
  )
  @JoinColumn({ name: 'mid' })
  parent: PublicFiles;

  @OneToMany(
    () => PublicFiles,
    (publicFiles: PublicFiles) => publicFiles.parent,
  )
  children: PublicFiles[];

  @Column({ name: 'com_id', nullable: true }) // Company id
  public comId: number;

  @Column('int', { array: true, name: 'view_user_ids', nullable: true })
  viewUserIds?: number[];

  @Column({ type: 'text', nullable: true })
  name: string; //File name

  @Column({ type: 'text', nullable: true })
  exp: string; //File name system date unix time

  @Column({ type: 'jsonb', name: 'fileIds', nullable: true })
  public fileIds: LocalFile[]; // FILE UPLOAD

  @Column({ name: 'file_id', nullable: true })
  fileId: number;

  @Column({
    type: 'enum',
    enum: FileType,
    nullable: true,
  })
  type: FileType;

  @Column({ nullable: true })
  size: number; //Файлын хэмжээ

  @Column({ nullable: true })
  access: number; //Хэрэглэгчийн хязгаарлалтай эсэх

  @Column({ nullable: true })
  share: number; //Private | Public 0 1

  @OneToMany(
    () => PublicViewUser,
    (viewUser: PublicViewUser) => viewUser.publicFile,
    { onUpdate: 'CASCADE' },
  )
  public viewUsers: PublicViewUser[]; // Гэрээ харах хэрэглэгчид

  @Column({ name: 'is_comment_hide', default: false, nullable: true })
  public isCommentHide: boolean; // Сэтгэгдэлд нэрээ нууж болно

  @Column({ name: 'is_hide_download', default: false, nullable: true })
  public isHideDownload: boolean; // Татах товч харагдах эсэх

  @Column({ name: 'is_favourite', default: false, nullable: true })
  public isFavourite: boolean; // Одтой эсэх

  @Column({ name: 'is_deleted', default: false, nullable: true })
  public isDeleted: boolean; // Устгасан

  @Column({ type: 'jsonb', nullable: true })
  author?: Record<string, any>;

  @Column({ type: 'timestamptz', nullable: true })
  date: Date; //Нэмсэн огноо

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
