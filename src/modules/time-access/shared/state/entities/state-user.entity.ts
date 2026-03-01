import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
@Entity('time_access_shared_state_byuser_k')
// State хамаарах хэрэглэгчид
export default class StateViewUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' }) //Хэрэглэгчийн id
  public userId: number;
}
