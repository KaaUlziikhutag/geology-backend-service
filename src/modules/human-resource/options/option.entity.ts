import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('human_resource_options_option_i')
export default class Option extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'com_id', nullable: true })
  comId: number;

  @Column('varchar', { length: 800, nullable: true })
  module: string;

  @Column({ name: 'is_birth_day_mail', default: false, nullable: true })
  isBirthDayMail: boolean;

  @Column({ name: 'is_own_moderator', default: false, nullable: true })
  isOwnModerator: boolean;

  @Column({ name: 'is_double_code', default: false, nullable: true })
  isDoubleCode: boolean;

  @Column({ name: 'is_hide_sub_coms', default: false, nullable: true })
  isHideSubComs: boolean;

  @Column({ name: 'is_award_show', default: false, nullable: true })
  isAwardShow: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
