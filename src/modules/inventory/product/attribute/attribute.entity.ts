import { Column, Entity, OneToMany } from 'typeorm';
import AttributeValue from './attribute-value/attribute-value.entity';
import { AbstractEntity } from '@utils/abstract.entity';

@Entity('attributes')
export default class Attribute extends AbstractEntity {
  @Column()
  name: string;

  @OneToMany(
    () => AttributeValue,
    (attributeValue) => attributeValue.attribute,
    { cascade: true },
  )
  values?: AttributeValue[];
}
