import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('local_file')
class LocalFile {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ default: 0, nullable: true })
  public itemId: number; // Гэрээ, Тушаал шийдвэрийн id

  @Column('varchar', { length: 255, nullable: true })
  pro: string; //Pro - Contract, Decision

  @Column('varchar', { length: 255, nullable: true })
  mod: string; //inner,above, contract

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  mimetype: string;
}

export default LocalFile;
