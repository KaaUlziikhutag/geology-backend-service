import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import Server from '../server.entity';

@Entity('mail_server_connection_users')
export default class ServerConnectionUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'server_id' })
  public serverId: number;
  @ManyToOne(() => Server, (server: Server) => server.connUser, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'server_id' })
  public server: Server; // Server id

  @Column({ unique: true })
  public email: string; //Тухайн хэрэглэгчийн имэйл хаяг

  @Column({ nullable: true })
  @Exclude()
  public password?: string; //Тухайн хэрэглэгчийн нууц үг

  @Column({ name: 'error_cnt' })
  public errorCnt: number; //Тухайн хэрэглэгч алдааны тоо

  @Column({ name: 'exc_date', type: 'timestamptz', nullable: true })
  excDate: Date; //Огноо

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ name: 'user_id' })
  public userId: number; //User id
}
