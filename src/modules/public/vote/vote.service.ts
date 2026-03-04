import { Injectable } from '@nestjs/common';
import { CreatePublicVoteDto } from './dto/create-vote.dto';
import { UpdatePublicVoteDto } from './dto/update-vote.dto';
import { GetPublicVoteDto } from './dto/get-vote.dto';
import { EntityManager, Equal, FindManyOptions, In, Repository } from 'typeorm';
import PublicVote from './vote.entity';
import PublicVoteNotFoundException from './exceptions/vote-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken, InjectRepository } from '@nestjs/typeorm';

import { VoteQuestionService } from './question/question.service';
import Trees from '../../human-resource/tree/tree.entity';
import IUser from '@modules/users/interface/user.interface';

@Injectable()
export class PublicVoteService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(PublicVote)
    private readonly publicVoteRepository: Repository<PublicVote>,
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
  async getAllVote(query: GetPublicVoteDto) {
    const where: FindManyOptions<PublicVote>['where'] = {};
    if (query.exp) {
      where.exp = Equal(query.exp);
    }
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
    const [items, count] = await this.publicVoteRepository.findAndCount({
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
  async getVoteById(voteId: number): Promise<PublicVote> {
    const vote = await this.publicVoteRepository.findOne({
      where: { id: voteId },
      relations: ['questions', 'questions.voteAnswer'],
    });
    if (vote) {
      return vote;
    }
    throw new PublicVoteNotFoundException(voteId);
  }

  /**
   *
   * @param SystemMail createSystemMail
   *
   */
  async createVote(vote: CreatePublicVoteDto, user: IUser) {
    // Assign author details
    vote.authorId = user.id;

    // Validate treeIds
    if (vote.treeIds?.length) {
      // const trees = await entityManager.find(Trees, {
      //   where: { id: In(vote.treeIds) },
      // });
      // if (trees.length !== vote.treeIds.length) {
      //   throw new Error('Some of the treeIds are invalid');
      // }
      // vote.trees = trees;
    }

    // Create a new PublicVote entity (excluding ID)
    const newVote = this.publicVoteRepository.create({ ...vote });
    await this.publicVoteRepository.save(newVote); // Now, newVote has an id

    // Ensure vote.questions exist before iterating
    if (vote.questions?.length) {
      for (const question of vote.questions) {
        await this.voteQuestionService.createVoteQuestion(
          {
            option: question.option,
            voteId: newVote.id,
            authorId: null,
          },
          user,
        );
      }
    }

    return newVote;
  }

  /**
   * See the [definition of the UpdateContractDto file]{@link UpdateSystemMailDto} to see a list of required properties
   */
  async updateVote(id: number, vote: UpdatePublicVoteDto): Promise<PublicVote> {
    const existingVote = await this.publicVoteRepository.findOne({
      where: { id },
    });
    if (!existingVote) {
      throw new PublicVoteNotFoundException(id);
    }
    // if (vote.treeIds?.length) {
    //   const trees = await entityManager.find(Trees, {
    //     where: { id: In(vote.treeIds) },
    //   });
    //   if (trees.length !== vote.treeIds.length) {
    //     throw new Error('Some of the treeIds are invalid');
    //   }
    //   vote.trees = trees;
    // }
    await this.publicVoteRepository.update(id, vote);
    const updatedVote = await this.publicVoteRepository.findOne({
      where: { id },
    });
    if (!updatedVote) {
      throw new PublicVoteNotFoundException(id);
    }
    return updatedVote;
  }

  /**
   * @deprecated Use deleteContract instead
   */
  async deleteVoteById(id: number): Promise<void> {
    return this.deleteVote(id);
  }

  /**
   * A method that deletes a contract from the database
   * @param id An id of a contract. A contract with this id should exist in the database
   */
  async deleteVote(id: number): Promise<void> {
    const deleteResponse = await this.publicVoteRepository.softDelete(id);
    if (!deleteResponse.affected) {
      throw new PublicVoteNotFoundException(id);
    }
  }
}
