import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Attribute from './attribute.entity';
import { Equal, FindManyOptions, ILike, Not, Repository } from 'typeorm';
import GetAttributeDto from './dto/get-attribute.dto';
import CategoryService from '../category/category.service';
import CreateAttributeDto from './dto/create-attribute.dto';
import AttributeValue from './attribute-value/attribute-value.entity';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import PageAttributeDto from './dto/page-attribute.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import PageDto from '@utils/dto/page.dto';

@Injectable()
export default class AttributeService {
  constructor(
    @InjectRepository(Attribute)
    private readonly attributeRepository: Repository<Attribute>,
    @InjectRepository(AttributeValue)
    private readonly valueRepository: Repository<AttributeValue>,
    private readonly categoryService: CategoryService,
  ) {}

  // Аттрибутийн жагсаалт
  async getAll(dto: GetAttributeDto) {
    const where: FindManyOptions<Attribute>['where'] = {};
    if (dto.categoryId) {
      where.values = {
        variants: {
          product: { categories: { id: Equal(dto.categoryId) } },
        },
      };
    }
    return this.attributeRepository.find({ where, relations: ['values'] });
  }

  async getPage(query: PageAttributeDto) {
    const { page, skip, limit } = query;
    const where: FindManyOptions<Attribute>['where'] = {};
    if (query.search) {
      where.name = ILike(`%${query.search}%`);
    }
    const [items, itemCount] = await this.attributeRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: query.order },
      relations: ['values'],
    });
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  async create(dto: CreateAttributeDto) {
    const exists = await this.attributeRepository.findOne({
      where: { name: ILike(dto.name) },
    });
    if (exists) {
      throw new BadRequestException('ATTRIBUTE.NAME_ALREADY_EXISTS');
    }
    const attribute = this.attributeRepository.create({
      name: dto.name,
      values:
        dto.values?.map((v) => this.valueRepository.create({ value: v })) || [],
    });
    return await this.attributeRepository.save(attribute);
  }

  async update(id: number, dto: UpdateAttributeDto) {
    const attribute = await this.attributeRepository.findOne({
      where: { id },
      relations: ['values'],
    });

    if (!attribute) throw new NotFoundException('ATTRIBUTE.NOT_FOUND');

    // check for duplicate name (excluding self)
    if (dto.name) {
      const duplicate = await this.attributeRepository.findOne({
        where: { name: ILike(dto.name), id: Not(id) },
      });
      if (duplicate) {
        throw new BadRequestException('ATTRIBUTE.NAME_ALREADY_EXISTS');
      }
      attribute.name = dto.name;
    }

    // update values
    if (dto.values) {
      await this.valueRepository.delete({ attributeId: id }); // old values устгана
      attribute.values = dto.values.map((v) =>
        this.valueRepository.create({ value: v }),
      );
    }

    return await this.attributeRepository.save(attribute);
  }

  async remove(id: number) {
    const attribute = await this.attributeRepository.findOne({
      where: { id },
      relations: ['values.variants'],
    });
    if (attribute.values.some((value) => value.variants.length > 0)) {
      throw new BadRequestException('ATTRIBUTE.VARIANTS_FOUND');
    }
    if (!attribute) {
      throw new NotFoundException('ATTRIBUTE.NOT_FOUND');
    }
    const result = await this.attributeRepository.softDelete(attribute.id);

    if (result.affected === 0)
      return { message: 'ATTRIBUTE.DELETED_SUCCESSFULLY' };
  }
}
