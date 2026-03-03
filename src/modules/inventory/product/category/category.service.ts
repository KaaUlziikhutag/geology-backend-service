import { InjectRepository } from '@nestjs/typeorm';
import Category from './category.entity';
import { Equal, FindManyOptions, In, IsNull, Repository } from 'typeorm';
import GetCategoryDto from './dto/get-category.dto';
import CreateCategoryDto from './dto/create-category.dto';
import UpdateCategoryDto from './dto/update-category.dto';
import { ReorderCategoryDto } from './dto/reorder-category.dto';

export default class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getAll(dto: GetCategoryDto) {
    const where: FindManyOptions<Category>['where'] = {};
    if (dto.categoryId) {
      where.categoryId = Equal(dto.categoryId);
    } else {
      where.categoryId = IsNull();
    }
    if (dto.isFeature) {
      where.isFeature = Equal(dto.isFeature);
    }
    return await this.categoryRepository.find({
      where,
      relations: ['categories.categories'],
      order: { position: 'ASC' },
    });
    //  this.getNested(categories);
  }

  async getNested(categories: Category[]): Promise<Category[]> {
    return await Promise.all(
      categories.map(async (item) => {
        const category = await this.categoryRepository.findOne({
          where: { id: Equal(item.id) },
          relations: ['categories'],
          order: { position: 'ASC' },
        });
        if (category.categories && category.categories.length > 0) {
          item.categories = await this.getNested(category.categories);
        }
        return item;
      }),
    );
  }

  async getAllDescendantIds(parentId: string) {
    const result = await this.categoryRepository.query(
      `
      WITH RECURSIVE category_cte AS (
        SELECT id FROM categories WHERE category_id = $1
        UNION ALL
        SELECT c.id
        FROM categories c
        INNER JOIN category_cte p ON c.category_id = p.id
      )
      SELECT id FROM category_cte;
      `,
      [parentId],
    );
    return result.map((row) => row.id);
  }

  async getById(id: number) {
    return this.categoryRepository.findOne({ where: { id } });
  }

  async getByIds(ids: number[]) {
    return this.categoryRepository.find({
      where: { id: In(ids) },
      order: { createdAt: 'ASC' },
    });
  }

  async create(dto: CreateCategoryDto) {
    const newCategory = this.categoryRepository.create(dto);
    return await this.categoryRepository.save(newCategory);
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.categoryRepository.update(id, dto);
    return this.getById(id);
  }

  async remove(id: number) {
    const category = await this.getById(id);
    return this.categoryRepository.remove(category);
  }
  async reorder(items: ReorderCategoryDto[]) {
    for (const item of items) {
      await this.categoryRepository.update(
        { id: item.id },
        {
          categoryId: item.categoryId,
          position: item.position,
        },
      );
    }
  }
}
