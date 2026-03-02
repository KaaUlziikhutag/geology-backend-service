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
import Address from './address/address.entity';
import MailUser from './users/users.entity';
import { RelationIdDto } from '@utils/dto/relation-id.dto';

@Entity('mail_i')
export default class Mail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  subject: string; //Гарчиг

  @Column({ type: 'text' })
  letter: string; //Агуулга

  @Column({ name: 'author_id', nullable: true }) //Нэмсэн хүний id
  public authorId: number;

  @Column('varchar', { length: 6, nullable: true })
  size: string; //Хэмжээ

  @Column('varchar', { length: 50, nullable: true })
  folder: string; //Фолдер

  @Column({ type: 'timestamptz', nullable: true })
  date: Date; //Огноо

  @Column('varchar', { name: 'msg_id', length: 50, nullable: true })
  msgId: string; //msg Id

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  @OneToMany(() => Address, (address: Address) => address.mail, {
    onUpdate: 'CASCADE',
  })
  public address: Address[]; //Email addresses

  @Column({ type: 'jsonb', name: 'fileIds', nullable: true })
  public fileIds: RelationIdDto[]; // FILE UPLOADclear

  @OneToMany(() => MailUser, (users: MailUser) => users.mail, {
    onUpdate: 'CASCADE',
  })
  public users: MailUser[]; //Email users
}
