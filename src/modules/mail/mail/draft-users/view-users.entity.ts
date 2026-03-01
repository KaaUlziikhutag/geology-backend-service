import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Signature from '../../signature/signature.entity';

@Entity('mail_signature_view_users')
export default class SignatureViewUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'signature_id' })
  public signatureId: number;
  @ManyToOne(() => Signature, (signature: Signature) => signature.viewUsers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'signature_id' })
  public signature: Signature; //Signature id

  @Column({ name: 'is_active', default: false, nullable: true })
  public isActive: boolean; //Идэвхтэй эсэх

  @Column({ name: 'user_id' })
  public userId: number; //User id
}
