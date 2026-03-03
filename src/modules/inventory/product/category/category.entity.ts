import { AbstractEntity } from '@utils/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

/** Ангилал */
@Entity('categories')
export default class Category extends AbstractEntity {
  @Column({ name: 'category_id', nullable: true })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.categories)
  @JoinColumn({ name: 'category_id' })
  category: Category; // Ангилал

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, nullable: true })
  description: string;

  @Column({ name: 'is_feature', type: 'boolean', default: false })
  isFeature: boolean;

  @Column('int', { nullable: true })
  position: number;

  @OneToMany(() => Category, (category) => category.category)
  categories: Category[]; // Барааны ангилалууд
}
