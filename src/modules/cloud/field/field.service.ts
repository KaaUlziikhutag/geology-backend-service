import { Injectable } from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { GetFieldDto } from './dto/get-field.dto';
import { Equal, FindManyOptions, Repository } from 'typeorm';
import Fields from './field.entity';
import FieldNotFoundException from './exceptions/field-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FieldService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(Fields)
    private fieldsRepository: Repository<Fields>,
  ) {}

  /**
   * A method that fetches the Field from the database
   * @returns A promise with the list of Fields
   */
  async getAllFields(query: GetFieldDto) {
    const where: FindManyOptions<Fields>['where'] = {};
    if (query.pos) {
      where.pos = Equal(query.pos);
    }
    const page =
      query.page && !isNaN(query.page) && query.page > 0
        ? Number(query.page)
        : 1;
    const limit =
      query.limit && !isNaN(query.limit) && query.limit > 0
        ? Number(query.limit)
        : 10;
    const skip = (page - 1) * limit;
    const [items, count] = await this.fieldsRepository.findAndCount({
      where,
      order: {
        pos: 'ASC',
      },
      skip: skip,
      take: limit,
    });
    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }
  /**
   * A method that fetches a Field with a given id. Example:
   *
   * @example
   * const Field = await FieldService.getFieldById(1);
   */
  async getFieldById(fieldId: number): Promise<Fields> {
    const field = await this.fieldsRepository.findOne({
      where: { id: fieldId },
    });
    if (field) {
      return field;
    }
    throw new FieldNotFoundException(fieldId);
  }

  async getFieldByIds(
    workerId: number,
    program: string,
    module: string,
  ): Promise<Fields[] | null> {
    const fields = await this.fieldsRepository.find({
      where: { workerId: workerId, program: program, module: module },
    });

    if (fields.length > 0) {
      return fields;
    }

    return null;
  }

  /**
   *
   * @param Field createField
   *
   */
  async createField(field: CreateFieldDto) {
    const newField = this.fieldsRepository.create(field);
    await this.fieldsRepository.save(newField);
    return newField;
  }

  /**
   * See the [definition of the UpdateFieldDto file]{@link UpdateFieldDto} to see a list of required properties
   */
  async updateField(id: number, field: UpdateFieldDto): Promise<Fields> {
    await this.fieldsRepository.update(id, field);
    const updatedField = await this.fieldsRepository.findOne({
      where: { id: id },
    });
    if (updatedField) {
      return updatedField;
    }
    throw new FieldNotFoundException(id);
  }

  /**
   * @deprecated Use deleteField instead
   */
  async deleteFieldById(id: number): Promise<void> {
    return this.deleteField(id);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteField(id: number): Promise<void> {
    const deleteResponse = await this.fieldsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new FieldNotFoundException(id);
    }
  }
}
