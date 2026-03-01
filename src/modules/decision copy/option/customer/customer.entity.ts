import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('decision_customer_i') //Тушаал шийдвэр оролцогчид
export default class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'com_id' }) //Компани id
  public comId: number;

  @Column({ name: 'author_id' }) //Author id
  public authorId: number;

  @Column('varchar', { length: 100, nullable: true })
  name: string; //Байгууллагын нэр

  @Column('varchar', { length: 100, nullable: true })
  type: string; //Байгууллагын төрөл

  @Column('varchar', { length: 40, nullable: true })
  phone: string; //Байгууллагын утас

  @Column('varchar', { length: 40, nullable: true })
  fax: string; //Байгууллагын fax

  @Column('varchar', { length: 40, nullable: true })
  web: string; //Байгууллагын web

  @Column('varchar', { length: 100, nullable: true })
  address: string; //Хаяг

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
