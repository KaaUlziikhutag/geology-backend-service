import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('system_mail_i')
export default class SystemMail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' }) // Гарчиг
  subject: string;

  @Column({ type: 'text' })
  letter: string; //Агуулга

  @Column('varchar', { length: 6, nullable: true })
  size: string; //Агуулга

  @Column({ name: 'mail_type' })
  mailType: number; //Имэйлийн төрөл 0 энгийн 1 системийн

  @Column({ type: 'timestamptz', nullable: true })
  date: Date; //Огноо

  @Column({ name: 'user_id' })
  public userId: number; //Хэрэглэгчийн id

  @Column({ name: 'is_new', default: false, nullable: true })
  public isNew: boolean; //Уншсан уншаагүй

  @Column({ name: 'group_id' })
  public groupId: number; //group id

  @Column({ name: 'is_starred', default: false, nullable: true })
  public isStarred: boolean; //Тэмдэглэгээ

  @Column({ name: 'is_fired', default: false, nullable: true })
  public isFired: boolean; //Тэмдэглэгээ

  @Column('varchar', { length: 25, nullable: true })
  pro: string; //Програм нэр

  @Column('varchar', { length: 25, nullable: true })
  mod: string; //Модул нэр

  @Column('varchar', { name: 'item_id', length: 30, nullable: true })
  itemId: string; //Бүтээгдэхүүн id

  @Column('varchar', { name: 'msg_id', length: 50, nullable: true })
  msgId: string; //Msg id

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
