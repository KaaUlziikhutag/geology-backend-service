import { Injectable } from '@nestjs/common';
import { CreatePublicNewsDto } from './dto/create-news.dto';
import { UpdatePublicNewsDto } from './dto/update-news.dto';
import { GetPublicNewsDto } from './dto/get-news.dto';
import { Between, EntityManager, Equal, FindManyOptions, In } from 'typeorm';
import PublicNews from './news.entity';
import PublicNewsNotFoundException from './exceptions/news-not-found.exception';
import { PageDto } from '../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../cloud/user/dto/get-user.dto';
import { UserView } from './entities/user-views.entity';
import { CreateUserViewDto } from './dto/create-user-view.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comments } from './entities/comment.entity';
import UserLimit from '../../shared/access/entities/user-limit.entity';
import Trees from '../../human-resource/tree/tree.entity';

@Injectable()
export class PublicNewsService {
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
   * A method that fetches the Contract from the database
   * @returns A promise with the list of Contract
   */
  async getAllNews(query: GetPublicNewsDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<PublicNews>['where'] = {};

    if (query.title) {
      where.title = Equal(query.title);
    }
    if (query.authorId) {
      where.authorId = Equal(query.authorId);
    }
    if (query.startDate) {
      where.date = Between(query.startDate, query.endDate);
    }
    if (query.status) {
      where.status = Equal(query.status);
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

    const [items, count] = await entityManager.findAndCount(PublicNews, {
      where,
      order: {
        createdAt: 'DESC',
      },
      relations: ['newsLikes', 'comments', 'trees'],
      skip: skip,
      take: limit,
    });
    const itemsWithLikesCount = await Promise.all(
      items.map(async (item) => {
        const newsLikesCount = item.newsLikes ? item.newsLikes.length : 0;

        const [, viewCount] = await entityManager.findAndCount(UserView, {
          where: { newsId: item.id },
        });
        return {
          ...item,
          newsLikesCount,
          viewCount, // Нийт үзэлтийн тоог нэмнэ
        };
      }),
    );
    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });

    return new PageDto(itemsWithLikesCount, pageMetaDto);
  }

  /**
   * A method that fetches a Access with a given id. Example:
   *
   * @example
   * const Access = await AccessService.getAccessById(1);
   */
  async getNewsById(newsId: number, user: GetUserDto): Promise<PublicNews> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const news = await entityManager.findOne(PublicNews, {
      where: { id: newsId },
      relations: [
        'newsLikes',
        'newsLikes.workers',
        'newsLikes.workers.humans',
        'comments',
        'comments.workers',
        'comments.workers.humans',
      ],
    });
    if (news) {
      return news;
    }
    throw new PublicNewsNotFoundException(newsId);
  }

  async addUserView(createUserViewDto: CreateUserViewDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const { userId, newsId } = createUserViewDto;
    // Хэрэглэгч энэ мэдээг аль хэдийн үзсэн эсэхийг шалгана
    const existingView = await entityManager.findOne(UserView, {
      where: { userId, newsId },
    });
    if (!existingView) {
      const userView = new UserView();
      userView.userId = userId;
      userView.newsId = newsId;
      await entityManager.save(userView);
      return { message: 'View recorded' };
    }

    return { message: 'View already recorded' };
  }

  // news.service.ts

  async addComment(comment: CreateCommentDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    comment.userId = user.workerId;
    const newComment = entityManager.create(Comments, comment);
    await entityManager.save(newComment);
    return comment;
  }

  async deleteComment(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Comments, id);
    if (!deleteResponse.affected) {
      throw new PublicNewsNotFoundException(id);
    }
  }

  /**
   *
   * @param SystemMail createSystemMail
   *
   */
  async createNews(news: CreatePublicNewsDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    if (news.treeIds && news.treeIds.length > 0) {
      const trees = await entityManager.find(Trees, {
        where: { id: In(news.treeIds) },
      });
      if (!trees || trees.length !== news.treeIds.length) {
        throw new Error('Some of the treeIds are invalid');
      }
      news.trees = trees;
    }
    const newNews = entityManager.create(PublicNews, {
      ...news,
      authorId: user.id,
      author: {
        lastName: user.lastName,
        firstName: user.firstName,
        profileId: user.profileId,
      },
    });
    await entityManager.save(newNews);
    entityManager.create(UserLimit, {
      userId: user.id,
      itemId: newNews.id,
    });
    return newNews;
  }

  /**
   * See the [definition of the UpdateContractDto file]{@link UpdateSystemMailDto} to see a list of required properties
   */
  async updateNews(
    id: number,
    user: GetUserDto,
    news: UpdatePublicNewsDto,
  ): Promise<PublicNews> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(PublicNews, id, news);
    const updatedNews = await entityManager.findOne(PublicNews, {
      where: { id: id },
    });
    if (updatedNews) {
      return updatedNews;
    }
    throw new PublicNewsNotFoundException(id);
  }

  /**
   * @deprecated Use deleteContract instead
   */
  async deleteNewById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteNews(id, user);
  }

  /**
   * A method that deletes a contract from the database
   * @param id An id of a contract. A contract with this id should exist in the database
   */
  async deleteNews(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(PublicNews, id);
    if (!deleteResponse.affected) {
      throw new PublicNewsNotFoundException(id);
    }
  }
}
