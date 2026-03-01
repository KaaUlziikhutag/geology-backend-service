import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('global_files')
class GlobalFile {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  mimetype: string;
}

export default GlobalFile;
