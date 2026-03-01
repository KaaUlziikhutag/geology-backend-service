import { Injectable } from '@nestjs/common';
import { CreateNewsLikeDto } from './dto/create-like.dto';
import { UpdateNewsLikeDto } from './dto/update-like.dto';
import { GetNewsLikeDto } from './dto/get-like.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import NewsLike from './like.entity';
import NewsLikeNotFoundException from './exceptions/like-not-found.exception';
import { PageDto } from '../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../cloud/user/dto/get-user.dto';

@Injectable()
export class NewsLikeService {
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
  async getAllNewsLike(query: GetNewsLikeDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<NewsLike>['where'] = {};
    if (query.newsId) {
      where.newsId = Equal(query.newsId);
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
    const [items, count] = await entityManager.findAndCount(NewsLike, {
      where,
      order: {
        createdAt: 'DESC',
      },
      relations: ['voteQuestion'],
      skip: skip,
      take: limit,
    });
    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a Access with a given id. Example:
   *
   * @example
   * const Access = await AccessService.getAccessById(1);
   */
  async getNewsLikeById(
    newsLikeId: number,
    user: GetUserDto,
  ): Promise<NewsLike> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newsLike = await entityManager.findOne(NewsLike, {
      where: { id: newsLikeId },
      relations: ['voteQuestion'],
    });
    if (newsLike) {
      return newsLike;
    }
    throw new NewsLikeNotFoundException(newsLikeId);
  }

  /**
   *
   * @param SystemMail createSystemMail
   *
   */
  async createNewsLike(newsLike: CreateNewsLikeDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    newsLike.userId = user.workerId;
    if (newsLike.isLiked) {
      const newVote = entityManager.create(NewsLike, newsLike);
      await entityManager.save(newVote);
      return newVote;
    } else {
      const vote = await entityManager.findOne(NewsLike, {
        where: { newsId: newsLike.newsId, userId: newsLike.userId },
      });
      if (vote) {
        await entityManager.delete(NewsLike, { id: vote.id });
      }
    }
  }

  /**
   * See the [definition of the UpdateContractDto file]{@link UpdateSystemMailDto} to see a list of required properties
   */
  async updateNewsLike(
    id: number,
    user: GetUserDto,
    newsLike: UpdateNewsLikeDto,
  ): Promise<NewsLike> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(NewsLike, id, newsLike);
    const updatedVote = await entityManager.findOne(NewsLike, {
      where: { id: id },
    });
    if (updatedVote) {
      return updatedVote;
    }
    throw new NewsLikeNotFoundException(id);
  }

  /**
   * @deprecated Use deleteContract instead
   */
  async deleteNewsLikeById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteNewsLike(id, user);
  }

  /**
   * A method that deletes a contract from the database
   * @param id An id of a contract. A contract with this id should exist in the database
   */
  async deleteNewsLike(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(NewsLike, id);
    if (!deleteResponse.affected) {
      throw new NewsLikeNotFoundException(id);
    }
  }
}
