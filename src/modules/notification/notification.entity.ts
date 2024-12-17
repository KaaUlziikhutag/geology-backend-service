import { AbstractEntity } from '../../utils/abstract.entity.js';
import { Column, Entity, JoinColumn, Relation } from 'typeorm';
import Users from '../users/users.entity.js';

@Entity({ name: 'notifications' })
export class Notification extends AbstractEntity {
  @Column('varchar', { length: 255 })
  message: string;

  @Column('varchar', { length: 255 })
  url: string;

  @Column('boolean', { default: false })
  isRead: boolean;

  @Column({ name: 'receiver_id' })
  receiverId: number;
  @JoinColumn({ name: 'receiver_id' })
  receiver: Relation<Users>;
}
