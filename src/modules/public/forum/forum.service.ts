import { Injectable } from '@nestjs/common';
import { CreatePublicForumDto } from './dto/create-forum.dto';
import { UpdatePublicForumDto } from './dto/update-forum.dto';
import { GetPublicForumDto } from './dto/get-forum.dto';
import { EntityManager, Equal, FindManyOptions, In, Repository } from 'typeorm';
import PublicForum from './forum.entity';
import PublicForumNotFoundException from './exceptions/forum-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken, InjectRepository } from '@nestjs/typeorm';
import { VoteQuestionService } from '../vote/question/question.service';
import Trees from '../../human-resource/tree/tree.entity';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class PublicForumService {
  /**
   *
   * @ignore
   */
  constructor(
    @InjectRepository(PublicForum)
    private readonly forumRepository: Repository<PublicForum>,
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
  async getAllForum(query: GetPublicForumDto) {
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
    const [items, count] = await this.forumRepository.findAndCount({
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
  async getForumById(forumId: number): Promise<PublicForum> {
    const forum = await this.forumRepository.findOne({
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
  async createForum(forum: CreatePublicForumDto, user: IUser) {
    forum.authorId = user.id;
    // forum.author = {
    //   lastName: `${user.lastName}`,
    //   firstName: `${user.firstName}`,
    // };
    if (forum.treeIds?.length) {
      // const trees = await entityManager.find(Trees, {
      //   where: { id: In(forum.treeIds) },
      // });
      // if (trees.length !== forum.treeIds.length) {
      //   throw new Error('Some of the treeIds are invalid');
      // }
      // forum.trees = trees;
    }
    const newForum = this.forumRepository.create({ ...forum });
    await this.forumRepository.save(newForum);
    for (const question of forum.questions) {
      await this.voteQuestionService.createVoteQuestion(
        {
          option: question.option,
          forumId: newForum.id,
          authorId: user?.id,
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
    forum: UpdatePublicForumDto,
  ): Promise<PublicForum> {
    const existingForum = await this.forumRepository.findOne({
      where: { id },
    });
    if (!existingForum) {
      throw new PublicForumNotFoundException(id);
    }
    if (forum.treeIds?.length) {
      // const trees = await entityManager.find(Trees, {
      //   where: { id: In(forum.treeIds) },
      // });
      // if (trees.length !== forum.treeIds.length) {
      //   throw new Error('Some of the treeIds are invalid');
      // }
      // forum.trees = trees;
    }
    await this.forumRepository.update(id, forum);
    const updatedForum = await this.forumRepository.findOne({
      where: { id },
    });
    if (!updatedForum) {
      throw new PublicForumNotFoundException(id);
    }

    return updatedForum;
  }

  // async updateForum(
  //   id: number,
  //   user: IUser,
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
  async deleteForumById(id: number): Promise<void> {
    return this.deleteForum(id);
  }

  /**
   * A method that deletes a contract from the database
   * @param id An id of a contract. A contract with this id should exist in the database
   */
  async deleteForum(id: number): Promise<void> {
    const deleteResponse = await this.forumRepository.softDelete(id);
    if (!deleteResponse.affected) {
      throw new PublicForumNotFoundException(id);
    }
  }
}
