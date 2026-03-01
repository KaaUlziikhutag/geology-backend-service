import { Injectable } from '@nestjs/common';
import { CreatePublicForumDto } from './dto/create-forum.dto';
import { UpdatePublicForumDto } from './dto/update-forum.dto';
import { GetPublicForumDto } from './dto/get-forum.dto';
import { EntityManager, Equal, FindManyOptions, In } from 'typeorm';
import PublicForum from './forum.entity';
import PublicForumNotFoundException from './exceptions/forum-not-found.exception';
import { PageDto } from '../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../cloud/user/dto/get-user.dto';
import { VoteQuestionService } from '../vote/question/question.service';
import Trees from '../../human-resource/tree/tree.entity';

@Injectable()
export class PublicForumService {
  /**
   *
   * @ignore
   */
  constructor(
    private moduleRef: ModuleRef,
    private readonly voteQuestionService: VoteQuestionService,
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
  async getAllForum(query: GetPublicForumDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<PublicForum>['where'] = {};

    if (query.authorId) {
      where.authorId = Equal(query.authorId);
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
    const [items, count] = await entityManager.findAndCount(PublicForum, {
      where,
      order: {
        createdAt: 'DESC',
      },
      relations: ['questions', 'questions.voteAnswer'],
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
  async getForumById(forumId: number, user: GetUserDto): Promise<PublicForum> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const forum = await entityManager.findOne(PublicForum, {
      where: { id: forumId },
      relations: ['questions', 'questions.voteAnswer'],
    });
    if (forum) {
      return forum;
    }
    throw new PublicForumNotFoundException(forumId);
  }

  /**
   *
   * @param SystemMail createSystemMail
   *
   */
  async createForum(forum: CreatePublicForumDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    forum.authorId = user.workerId;
    forum.author = {
      lastName: `${user.lastName}`,
      firstName: `${user.firstName}`,
    };
    if (forum.treeIds?.length) {
      const trees = await entityManager.find(Trees, {
        where: { id: In(forum.treeIds) },
      });

      if (trees.length !== forum.treeIds.length) {
        throw new Error('Some of the treeIds are invalid');
      }

      forum.trees = trees;
    }
    const newForum = entityManager.create(PublicForum, { ...forum });
    await entityManager.save(newForum);
    for (const question of forum.questions) {
      await this.voteQuestionService.createVoteQuestion(
        {
          option: question.option,
          forumId: newForum.id,
          authorId: user?.workerId,
        },
        user,
      );
    }
    return newForum;
  }

  /**
   * See the [definition of the UpdateContractDto file]{@link UpdateSystemMailDto} to see a list of required properties
   */
  async updateForum(
    id: number,
    user: GetUserDto,
    forum: UpdatePublicForumDto,
  ): Promise<PublicForum> {
    const entityManager = await this.loadEntityManager(user.dataBase);

    const existingForum = await entityManager.findOne(PublicForum, {
      where: { id },
    });
    if (!existingForum) {
      throw new PublicForumNotFoundException(id);
    }
    if (forum.treeIds?.length) {
      const trees = await entityManager.find(Trees, {
        where: { id: In(forum.treeIds) },
      });
      if (trees.length !== forum.treeIds.length) {
        throw new Error('Some of the treeIds are invalid');
      }
      forum.trees = trees;
    }
    await entityManager.update(PublicForum, id, forum);
    const updatedForum = await entityManager.findOne(PublicForum, {
      where: { id },
    });
    if (!updatedForum) {
      throw new PublicForumNotFoundException(id);
    }

    return updatedForum;
  }

  // async updateForum(
  //   id: number,
  //   user: GetUserDto,
  //   forum: UpdatePublicForumDto,
  // ): Promise<PublicForum> {
  //   const entityManager = await this.loadEntityManager(user.dataBase);
  //   await entityManager.update(PublicForum, id, forum);
  //   const updatedForum = await entityManager.findOne(PublicForum, {
  //     where: { id: id },
  //   });
  //   if (updatedForum) {
  //     return updatedForum;
  //   }
  //   throw new PublicForumNotFoundException(id);
  // }

  /**
   * @deprecated Use deleteContract instead
   */
  async deleteForumById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteForum(id, user);
  }

  /**
   * A method that deletes a contract from the database
   * @param id An id of a contract. A contract with this id should exist in the database
   */
  async deleteForum(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(PublicForum, id);
    if (!deleteResponse.affected) {
      throw new PublicForumNotFoundException(id);
    }
  }
}
