import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import Mail from '../mail.entity';
import { MailType } from '@utils/enum-utils';
import Worker from '../../../human-resource/member/worker/worker.entity';
import Signature from '../../../mail/signature/signature.entity';

@Entity('mail_by_users')
export default class MailUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'mail_id' })
  public mailId: number;
  @ManyToOne(() => Mail, (mail: Mail) => mail.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'mail_id' })
  public mail: Mail; //Email id

  @Column({ name: 'user_id' })
  public userId: number; // User id
  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => Worker)
  worker?: Worker;

  @Column({
    type: 'enum',
    enum: MailType,
    default: MailType.Inbox,
  })
  state: MailType; // Mail type

  @Column({ name: 'group_id', nullable: true })
  public groupId: number; //group id

  @Column({ name: 'reply_id', nullable: true })
  public replyId: number; //reply id

  @Column({ name: 'signature_id', nullable: true })
  public signatureId: number; //signature id
  @JoinColumn({ name: 'signature_id' })
  @ManyToOne(() => Signature)
  signature?: Signature;

  @Column({ name: 'is_to', default: false, nullable: true })
  public isTo: boolean; //email to

  @Column({ name: 'is_cc', default: false, nullable: true })
  public isCc: boolean; //email cc

  @Column({ name: 'is_bcc', default: false, nullable: true })
  public isBcc: boolean; //email bcc

  @Column({ name: 'is_exist', default: false, nullable: true })
  public isExist: boolean; //Is exist

  @Column({ name: 'is_trash', default: false, nullable: true })
  public isTrash: boolean; //Is trash имэйл устгасан эсэх

  @Column({ name: 'is_read', default: false, nullable: true })
  public isRead: boolean; // Имэйл уншсан эсэх

  @Column({ name: 'is_favourite', default: false, nullable: true })
  public isFavourite: boolean; // Одтой эсэх

  @Column({ type: 'timestamptz', nullable: true })
  date: Date; //Огноо

  @Column({ name: 'starred_date', type: 'timestamptz', nullable: true })
  starredDate: Date; //Тэмдэглэсэн огноо

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
