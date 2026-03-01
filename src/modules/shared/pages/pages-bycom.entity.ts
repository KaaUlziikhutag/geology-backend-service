import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('shared_pages_bycom_k')
export default class PagesBycom extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  // userId
  // type - isShow

  //omId
  // page_i

  @Column({ nullable: true, name: 'page_id' })
  pageId: number;

  @Column({ nullable: true, name: 'page_key' })
  pageKey: number;

  @Column({ name: 'is_active', default: false, nullable: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
