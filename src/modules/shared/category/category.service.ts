import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { EntityManager, FindManyOptions, ILike, Repository } from 'typeorm';
import CategoryOrganization from './category.entity';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken, InjectRepository } from '@nestjs/typeorm';
import CategoryNotFoundException from './exceptions/category-not-found.exception';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class CategoryService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(CategoryOrganization)
    private categoryRepository: Repository<CategoryOrganization>,
    private moduleRef: ModuleRef,
  ) {}

  private async loadEntityManager(systemId: string): Promise<EntityManager> {
    return this.moduleRef.get(getEntityManagerToken(`ioffice_${systemId}`), {
      strict: false,
    });
  }

  /**
   * A method that fetches the Category from the database
   * @returns A promise with the list of Category
   */
  async getAllCategories(query: GetCategoryDto) {
    let where: FindManyOptions<CategoryOrganization>['where'] = {}; // const-ийг let болгон өөрчилнө

    if (query.name) {
      where.name = ILike(`%${query.name}%`);
    }
    if (query.note) {
      where.note = ILike(`%${query.note}%`);
    }
    if (query.filter) {
      where = [
        { name: ILike(`%${query.filter}%`) },
        { register: ILike(`%${query.filter}%`) },
        { mail: ILike(`%${query.filter}%`) },
        { phoneNumber: ILike(`%${query.filter}%`) },
      ];
    }

    const page =
      query.page && !isNaN(query.page) && query.page > 0
        ? Number(query.page)
        : 1;
    const limit =
      query.limit && !isNaN(query.limit) && query.limit > 0
        ? Number(query.limit)
        : undefined;
    const skip = limit ? (page - 1) * limit : undefined;

    const [items, count] = await this.categoryRepository.findAndCount({
      where,
      order: {
        createdAt: 'DESC',
      },
      skip,
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
  async getCategoryById(categoryId: number): Promise<CategoryOrganization> {
    const category = await this.categoryRepository.findOne({
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
    category.authorId = user.id;
    const checkRegNumber = await this.categoryRepository.findOne({
      where: { register: category.register },
    });
    if (checkRegNumber) {
      throw new HttpException(
        'Уг регистрийн дугаартай харилцагч бүртгэлтэй байна',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newCategory = this.categoryRepository.create(category);
    await this.categoryRepository.save(newCategory);
    return newCategory;
  }

  /**
   * See the [definition of the UpdateCategoryDto file]{@link UpdateCategoryDto} to see a list of required properties
   */
  async updateCategory(
    id: number,
    user: IUser,
    category: UpdateCategoryDto,
  ): Promise<CategoryOrganization> {
    // Одоогийн category-г шалгах
    const existingCategory = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!existingCategory) {
      throw new CategoryNotFoundException(id);
    }

    // Регистрийн дугаар давхардлыг шалгах
    if (category.register && category.register !== existingCategory.register) {
      const checkRegNumber = await this.categoryRepository.findOne({
        where: { register: category.register },
      });

      if (checkRegNumber) {
        throw new HttpException(
          'Уг регистрийн дугаартай харилцагч бүртгэлтэй байна',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Шинэчлэх процесс
    await this.categoryRepository.update(id, category);
    const updatedCategory = await this.categoryRepository.findOne({
      where: { id },
    });

    if (updatedCategory) {
      return updatedCategory;
    }
    throw new CategoryNotFoundException(id);
  }

  /**
   * @deprecated Use deleteCategory instead
   */
  async deleteCategoryById(id: number): Promise<void> {
    return this.deleteCategory(id);
  }

  /**
   * A method that deletes a category from the database
   * @param id An id of a category. A category with this id should exist in the database
   */
  async deleteCategory(id: number): Promise<void> {
    const deleteResponse = await this.categoryRepository.softDelete(id);
    if (!deleteResponse.affected) {
      throw new CategoryNotFoundException(id);
    }
  }
}
