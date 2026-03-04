import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { AbstractEntity } from '@utils/abstract.entity';
import { Citizen } from '@modules/cloud/citizen/entities/citizen.entity';

@Entity('users')
class Users extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;
  // begining authentication info
  @Column({ unique: true, nullable: true })
  name: string; // #used login хэрэглэгчийн давхцахгүй нэр

  @Column({ unique: true, nullable: true })
  email: string; // #used login хэрэглэгчийн давхцахгүй мэйл

  @Column({ unique: true, nullable: true })
  phone: string; // #used login хэрэглэгчийн давхцахгүй утасны дугаар

  @Column()
  @Exclude()
  password: string;

  @Column({ name: 'current_hashed_refresh_token', nullable: true })
  @Exclude()
  currentHashedRefreshToken: string;

  @Column({ nullable: true })
  dataBase: string;

  // ===========> begining activation info
  @Column({ name: 'is_email_confirmed', type: 'boolean', default: false })
  isEmailConfirmed: boolean;

  @Column({ name: 'is_phone_confirmed', type: 'boolean', default: false })
  isPhoneConfirmed: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: false })
  isActive: boolean;

  // @ManyToOne(() => Citizen, (citizen) => citizen.user)
  // profile: Citizen;
}

export default Users;
