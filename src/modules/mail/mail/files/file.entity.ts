import { float } from 'aws-sdk/clients/cloudfront';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Mail from '../mail.entity';

@Entity('mail_files')
export default class Files extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'mail_id', nullable: true })
  public mailId: number;
  // @ManyToOne(() => Mail, (mail: Mail) => mail.files, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // @JoinColumn({ name: 'mail_id' })
  // public mail: Mail; //Email id

  @Column('varchar', { length: 600, nullable: true })
  name: string; //Файлын нэр

  @Column('varchar', { length: 600, nullable: true })
  originalName: string; //Файлын нэр original

  @Column({ nullable: true })
  size: float; //Файл хэмжээ
}
