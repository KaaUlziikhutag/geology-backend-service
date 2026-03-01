import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Mail from '../mail.entity';
import { MailAddressType } from '../../../../utils/enumUtils';

@Entity('mail_addresses')
export default class Address extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'mail_id' })
  public mailId: number;
  @ManyToOne(() => Mail, (mail: Mail) => mail.address, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'mail_id' })
  public mail: Mail; //Email id

  @Column('varchar', { length: 200, nullable: true })
  personal: string; //Имэйлийн нэр

  @Column('varchar', { length: 200, nullable: true })
  mailbox: string; //Имэйлийн хаяг

  @Column('varchar', { length: 200, nullable: true })
  host: string; //Имэйл сервер хаяг

  @Column('varchar', { length: 200, nullable: true })
  address: string; //Бүтэн имэйлийн нэр

  @Column({
    type: 'enum',
    enum: MailAddressType,
    default: MailAddressType.To,
  })
  state: MailAddressType; // Address type
}
