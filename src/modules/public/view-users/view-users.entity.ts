import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Worker from '../../human-resource/member/worker/worker.entity';
import PublicFiles from '../file/file.entity';
import PublicGallery from '../gallery/gallery.entity';
@Entity('public_view_users')
export default class PublicViewUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'file_id', nullable: true }) // Гэрээний id
  public fileId: number;
  @ManyToOne(
    () => PublicFiles,
    (publicFile: PublicFiles) => publicFile.viewUsers,
    {
      nullable: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'file_id' })
  public publicFile: PublicFiles;

  @Column({ name: 'gallery_id', nullable: true }) // Гэрээний id
  public galleryId: number;
  @ManyToOne(
    () => PublicGallery,
    (publicGallery: PublicGallery) => publicGallery.viewUsers,
    {
      nullable: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'gallery_id' })
  public publicGallery: PublicGallery;

  @Column({ name: 'user_id' }) //Хэрэглэгчийн id
  public userId: number;
  @ManyToOne(() => Worker, (worker: Worker) => worker.viewUsers)
  @JoinColumn({ name: 'user_id' })
  public worker?: Worker;
}
