import { Injectable } from '@nestjs/common';
import { CreateNewsLikeDto } from './dto/create-like.dto';
import { UpdateNewsLikeDto } from './dto/update-like.dto';
import { GetNewsLikeDto } from './dto/get-like.dto';
import { EntityManager, Equal, FindManyOptions, Repository } from 'typeorm';
import NewsLike from './like.entity';
import NewsLikeNotFoundException from './exceptions/like-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken, InjectRepository } from '@nestjs/typeorm';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class NewsLikeService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(NewsLike)
    private readonly newsLikeRepository: Repository<NewsLike>,
    private moduleRef: ModuleRef,
  ) {}

  private async loadEntityManager(systemId: string): Promise<EntityManager> {
    return this.moduleRef.get(getEntityManagerToken(`ioffice_${systemId}`), {
      strict: false,
    });
  }

  /**
   * A method that fetches the Contract from the database
   * @returns A promise with the list of Contract
   */
  async getAllNewsLike(query: GetNewsLikeDto) {
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
    const [items, count] = await this.newsLikeRepository.findAndCount({
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
  async getNewsLikeById(newsLikeId: number): Promise<NewsLike> {
    const newsLike = await this.newsLikeRepository.findOne({
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
  async createNewsLike(newsLike: CreateNewsLikeDto, user: IUser) {
    newsLike.userId = user.id;
    if (newsLike.isLiked) {
      const newVote = this.newsLikeRepository.create(newsLike);
      await this.newsLikeRepository.save(newVote);
      return newVote;
    } else {
      const vote = await this.newsLikeRepository.findOne({
        where: { newsId: newsLike.newsId, userId: newsLike.userId },
      });
      if (vote) {
        await this.newsLikeRepository.delete({ id: vote.id });
      }
    }
  }

  /**
   * See the [definition of the UpdateContractDto file]{@link UpdateSystemMailDto} to see a list of required properties
   */
  async updateNewsLike(
    id: number,
    newsLike: UpdateNewsLikeDto,
  ): Promise<NewsLike> {
    await this.newsLikeRepository.update(id, newsLike);
    const updatedVote = await this.newsLikeRepository.findOne({
      where: { id },
    });
    if (updatedVote) {
      return updatedVote;
    }
    throw new NewsLikeNotFoundException(id);
  }

  /**
   * @deprecated Use deleteContract instead
   */
  async deleteNewsLikeById(id: number): Promise<void> {
    return this.deleteNewsLike(id);
  }

  /**
   * A method that deletes a contract from the database
   * @param id An id of a contract. A contract with this id should exist in the database
   */
  async deleteNewsLike(id: number): Promise<void> {
    const deleteResponse = await this.newsLikeRepository.softDelete(id);
    if (!deleteResponse.affected) {
      throw new NewsLikeNotFoundException(id);
    }
  }
}
