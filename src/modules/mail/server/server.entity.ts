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
import ServerConnectionUser from './connection-users/connection-users.entity';
import { SslType } from '@utils/enum-utils';

@Entity('mail_server_i')
export default class MailServer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'author_id' })
  public authorId: number; //Author id

  @Column({ name: 'com_id' })
  public comId: number; //Company id

  @Column('varchar', { length: 500, nullable: true })
  host: string; //Email server

  @Column('varchar', { length: 500, nullable: true })
  incoming: string; //Имэйл илгээх сервер

  @Column({ name: 'incoming_port' })
  public incomingPort: number; //Имэйл илгээх серве порт

  @Column({
    name: 'incoming_ssl',
    type: 'enum',
    enum: SslType,
    default: SslType.None,
  })
  public incomingSsl: SslType; // Ssl type

  @Column({ name: 'incoming_validate' })
  public incomingValidate: number;

  @Column('varchar', { length: 500, nullable: true })
  outgoing: string; //Имэйл хүлээж авах сервер

  @Column({ name: 'outgoing_port' })
  public outgoingPort: number; //Имэйл хүлээж авах сервер порт

  @Column({
    name: 'outgoing_ssl',
    type: 'enum',
    enum: SslType,
    default: SslType.None,
  })
  outgoingSsl: SslType; // Ssl type

  @Column({ name: 'outgoing_validate' })
  public outgoingValidate: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  @OneToMany(
    () => ServerConnectionUser,
    (connUser: ServerConnectionUser) => connUser.server,
    { onUpdate: 'CASCADE' },
  )
  public connUser: ServerConnectionUser[]; // Имэйл сервер холбосон хэрэглэгчид
}
