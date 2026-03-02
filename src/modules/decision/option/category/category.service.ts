import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { EntityManager, FindManyOptions, ILike } from 'typeorm';
import Category from './category.entity';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/cloud/user/interface/user.interface';
import CategoryNotFoundException from './exceptions/category-not-found.exception';

@Injectable()
export class CategoryService {
  /**
   * @ignore
   */
  constructor(private moduleRef: ModuleRef) {}

  private async loadEntityManager(systemId: string): Promise<EntityManager> {
    return this.moduleRef.get(getEntityManagerToken(`ioffice_${systemId}`), {
      strict: false,
    });
  }

  /**
   * A method that fetches the Category from the database
   * @returns A promise with the list of Category
   */
  async getAllCategories(query: GetCategoryDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Category>['where'] = {};
    if (query.name) {
      where.name = ILike('%' + query.name + '%');
    }
    if (query.note) {
      where.note = ILike('%' + query.note + '%');
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
    const [items, count] = await entityManager.findAndCount(Category, {
      where,
      order: {
        createdAt: 'DESC',
      },
      skip: skip,
      take: limit,
    });
    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a Category with a given id. Example:
   *
   * @example
   * const Category = await categoryService.getCategoryById(1);
   */
  async getCategoryById(categoryId: number, user: IUser): Promise<Category> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const category = await entityManager.findOne(Category, {
      where: { id: categoryId },
    });
    if (category) {
      return category;
    }
    throw new CategoryNotFoundException(categoryId);
  }

  /**
   *
   * @param Category createCategory
   *
   */
  async createCategory(category: CreateCategoryDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newCategory = entityManager.create(Category, category);
    await entityManager.save(newCategory);
    return newCategory;
  }

  /**
   * See the [definition of the UpdateCategoryDto file]{@link UpdateCategoryDto} to see a list of required properties
   */
  async updateCategory(
    id: number,
    user: IUser,
    category: UpdateCategoryDto,
  ): Promise<Category> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Category, id, category);
    const updatedCategory = await entityManager.findOne(Category, {
      where: { id: id },
    });
    if (updatedCategory) {
      return updatedCategory;
    }
    throw new CategoryNotFoundException(id);
  }

  /**
   * @deprecated Use deleteCategory instead
   */
  async deleteCategoryById(id: number, user: IUser): Promise<void> {
    return this.deleteCategory(id, user);
  }

  /**
   * A method that deletes a category from the database
   * @param id An id of a category. A category with this id should exist in the database
   */
  async deleteCategory(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Category, id);
    if (!deleteResponse.affected) {
      throw new CategoryNotFoundException(id);
    }
  }
}
