import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import SupervisorByusers from './supervisor-byuser.entity';

@Entity('time_access_options_supervisor_i')
export default class Supervisor extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'com_id', nullable: true })
  comId: number; //Company id

  @Column({ name: 'user_id', nullable: true }) //User id
  userId: number;

  @Column({ name: 'is_view', default: false, nullable: true }) // Бүртгэлийг харах
  public isView: boolean;

  @Column({ name: 'is_add', default: false, nullable: true }) // Цаг бүртгэх
  public isAdd: boolean;

  @Column({ name: 'is_mode', default: false, nullable: true }) // Төлөв оруулах
  public isMode: boolean;

  @Column({ name: 'is_rep_schedule', default: false, nullable: true }) // Хуваарь удирдах
  public isRepSchedule: boolean;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ name: 'autor_id', nullable: true }) //Author id
  autorId: number;

  @OneToMany(
    () => SupervisorByusers,
    (supervisorByusers: SupervisorByusers) => supervisorByusers.supervisors,
  )
  supervisorByusers?: SupervisorByusers[]; //Хариуцах ажилчид
}
