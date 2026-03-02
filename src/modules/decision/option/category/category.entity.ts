import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import Inner from '../../inner/inner.entity';
import Above from '../../above/above.entity';
import { DocumentTypes } from '@utils/enum-utils';
@Entity('decision_category_i') //Тушаал шийдвэр ангилал
export default class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'com_id', nullable: true }) //Компаний id
  public comId: number;

  @Column({ name: 'author_id', nullable: true })
  public authorId: number; //Author id

  @Column('varchar', { length: 150, nullable: true })
  name: string; //Тушаал шийдвэр ангилал нэр

  @Column('varchar', { length: 300, nullable: true })
  note: string; //Тайлбар

  @Column({
    type: 'enum',
    enum: DocumentTypes,
    name: 'document_type',
    nullable: true,
  })
  public documnetType: DocumentTypes;

  @Column('varchar', { length: 3, nullable: true })
  type: string; //Төрөл A Б

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  @OneToMany(() => Inner, (inner: Inner) => inner.category)
  inners?: Inner[];

  @OneToMany(() => Above, (above: Above) => above.category)
  aboves?: Above[];
}
