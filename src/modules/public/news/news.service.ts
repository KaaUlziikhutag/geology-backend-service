import { Injectable } from '@nestjs/common';
import { CreatePublicNewsDto } from './dto/create-news.dto';
import { UpdatePublicNewsDto } from './dto/update-news.dto';
import { GetPublicNewsDto } from './dto/get-news.dto';
import {
  Between,
  EntityManager,
  Equal,
  FindManyOptions,
  In,
  Repository,
} from 'typeorm';
import PublicNews from './news.entity';
import PublicNewsNotFoundException from './exceptions/news-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { UserView } from './entities/user-views.entity';
import { CreateUserViewDto } from './dto/create-user-view.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comments } from './entities/comment.entity';
import UserLimit from '../../shared/access/entities/user-limit.entity';
import Trees from '../../human-resource/tree/tree.entity';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class PublicNewsService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(PublicNews)
    private readonly newsRepository: Repository<PublicNews>,
    @InjectRepository(UserView)
    private readonly userViewRepository: Repository<UserView>,
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
    @InjectRepository(UserLimit)
    private readonly userLimitRepository: Repository<UserLimit>,
    private moduleRef: ModuleRef,
  ) {}

  /**
   * A method that fetches the Contract from the database
   * @returns A promise with the list of Contract
   */
  async getAllNews(query: GetPublicNewsDto) {
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

    const [items, count] = await this.newsRepository.findAndCount({
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

        const viewCount = await this.userViewRepository.count({
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
  async getNewsById(newsId: number): Promise<PublicNews> {
    const news = await this.newsRepository.findOne({
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

  async addUserView(createUserViewDto: CreateUserViewDto) {
    const { userId, newsId } = createUserViewDto;
    // Хэрэглэгч энэ мэдээг аль хэдийн үзсэн эсэхийг шалгана
    const existingView = await this.userViewRepository.findOne({
      where: { userId, newsId },
    });
    if (!existingView) {
      const userView = new UserView();
      userView.userId = userId;
      userView.newsId = newsId;
      await this.userViewRepository.save(userView);
      return { message: 'View recorded' };
    }

    return { message: 'View already recorded' };
  }

  // news.service.ts

  async addComment(comment: CreateCommentDto, user: IUser) {
    comment.userId = user.id;
    const newComment = this.commentsRepository.create(comment);
    await this.commentsRepository.save(newComment);
    return comment;
  }

  async deleteComment(id: number): Promise<void> {
    const deleteResponse = await this.commentsRepository.softDelete(id);
    if (!deleteResponse.affected) {
      throw new PublicNewsNotFoundException(id);
    }
  }

  /**
   *
   * @param SystemMail createSystemMail
   *
   */
  async createNews(news: CreatePublicNewsDto, user: IUser) {
    // if (news.treeIds && news.treeIds.length > 0) {
    //   const trees = await entityManager.find(Trees, {
    //     where: { id: In(news.treeIds) },
    //   });
    //   if (!trees || trees.length !== news.treeIds.length) {
    //     throw new Error('Some of the treeIds are invalid');
    //   }
    //   news.trees = trees;
    // }
    const newNews = this.newsRepository.create({
      ...news,
      authorId: user.id,
    });
    await this.newsRepository.save(newNews);
    this.userLimitRepository.create({
      userId: user.id,
      itemId: newNews.id,
    });
    return newNews;
  }

  /**
   * See the [definition of the UpdateContractDto file]{@link UpdateSystemMailDto} to see a list of required properties
   */
  async updateNews(id: number, news: UpdatePublicNewsDto): Promise<PublicNews> {
    await this.newsRepository.update(id, news);
    const updatedNews = await this.newsRepository.findOne({
      where: { id },
    });
    if (updatedNews) {
      return updatedNews;
    }
    throw new PublicNewsNotFoundException(id);
  }

  /**
   * @deprecated Use deleteContract instead
   */
  async deleteNewById(id: number): Promise<void> {
    return this.deleteNews(id);
  }

  /**
   * A method that deletes a contract from the database
   * @param id An id of a contract. A contract with this id should exist in the database
   */
  async deleteNews(id: number): Promise<void> {
    const deleteResponse = await this.newsRepository.softDelete(id);
    if (!deleteResponse.affected) {
      throw new PublicNewsNotFoundException(id);
    }
  }
}
