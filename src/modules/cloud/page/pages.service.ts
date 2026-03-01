import { Injectable } from '@nestjs/common';
import { CreatePagesDto } from './dto/create-pages.dto';
import { UpdatePagesDto } from './dto/update-pages.dto';
import { GetPagesDto } from './dto/get-pages.dto';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager, FindManyOptions, ILike } from 'typeorm';
import Pages from './pages.entity';
import PagesNotFoundException from './exceptions/pages-not-found.exception';
import { PageDto } from '../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import GetUserDto from '../user/dto/get-user.dto';

@Injectable()
export class PagesService {
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
   * A method that fetches the companies from the database
   * @returns A promise with the list of Pagess
   */
  async getAllPagess(query: GetPagesDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Pages>['where'] = {};
    if (query.name) {
      where.name = ILike('%' + query.name + '%');
    }
    const skip = (query.page - 1) * query.limit;
    const [items, count] = await entityManager.findAndCount(Pages, {
      where,
      order: {
        createdAt: 'DESC',
      },
      skip: skip,
      take: query.limit,
    });

    const page = Number(query.page);
    const limit = Number(query.limit);
    const itemCount = count;

    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });

    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a Pages with a given id. Example:
   *
   * @example
   * const Pages = await PagesService.getPagesById(1);
   */
  async getPagesById(pagesId: number, user: GetUserDto): Promise<Pages> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const pages = await entityManager.findOne(Pages, {
      where: { id: pagesId },
    });
    if (pages) {
      return pages;
    }
    throw new PagesNotFoundException(pagesId);
  }

  /**
   *
   * @param Pages createPages
   *
   */
  async createPages(pages: CreatePagesDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newPages = entityManager.create(Pages, pages);
    await entityManager.save(newPages);
    return newPages;
  }

  /**
   * See the [definition of the UpdatePagesDto file]{@link UpdatePagesDto} to see a list of required properties
   */
  async updatePages(
    id: number,
    pages: UpdatePagesDto,
    user: GetUserDto,
  ): Promise<Pages> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Pages, id, pages);
    const updatedPages = await entityManager.findOne(Pages, {
      where: { id: id },
    });
    if (updatedPages) {
      return updatedPages;
    }
    throw new PagesNotFoundException(id);
  }

  /**
   * @deprecated Use deletePages instead
   */
  async deletePagesById(id: number, user: GetUserDto): Promise<void> {
    return this.deletePages(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deletePages(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(Pages, id);
    if (!deleteResponse.affected) {
      throw new PagesNotFoundException(id);
    }
  }
}
