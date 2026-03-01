import { Injectable } from '@nestjs/common';
import { CreateVoteQuestionDto } from './dto/create-question.dto';
import { UpdateVoteQuestionDto } from './dto/update-question.dto';
import { GetVoteQuestionDto } from './dto/get-question.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import VoteQuestion from './question.entity';
import VoteQuestionNotFoundException from './exceptions/question-not-found.exception';
import { PageDto } from '../../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../cloud/user/dto/get-user.dto';

@Injectable()
export class VoteQuestionService {
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
  async getAllVoteQuestion(query: GetVoteQuestionDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<VoteQuestion>['where'] = {};
    if (query.option) {
      where.option = Equal(query.option);
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
    const [items, count] = await entityManager.findAndCount(VoteQuestion, {
      where,
      order: {
        createdAt: 'DESC',
      },
      relations: ['publicVote', 'publicForum'],
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
  async getVoteQuestionById(
    voteId: number,
    user: GetUserDto,
  ): Promise<VoteQuestion> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const vote = await entityManager.findOne(VoteQuestion, {
      where: { id: voteId },
      relations: ['publicVote', 'publicForum'],
    });
    if (vote) {
      return vote;
    }
    throw new VoteQuestionNotFoundException(voteId);
  }

  /**
   *
   * @param SystemMail createSystemMail
   *
   */
  async createVoteQuestion(vote: CreateVoteQuestionDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    vote.authorId = user.workerId;
    const newVote = entityManager.create(VoteQuestion, vote);
    await entityManager.save(newVote);
    return newVote;
  }

  /**
   * See the [definition of the UpdateContractDto file]{@link UpdateSystemMailDto} to see a list of required properties
   */
  async updateVoteQuestion(
    id: number,
    user: GetUserDto,
    vote: UpdateVoteQuestionDto,
  ): Promise<VoteQuestion> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(VoteQuestion, id, vote);
    const updatedVote = await entityManager.findOne(VoteQuestion, {
      where: { id: id },
    });
    if (updatedVote) {
      return updatedVote;
    }
    throw new VoteQuestionNotFoundException(id);
  }

  /**
   * @deprecated Use deleteContract instead
   */
  async deleteVoteQuestionById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteVoteQuestion(id, user);
  }

  /**
   * A method that deletes a contract from the database
   * @param id An id of a contract. A contract with this id should exist in the database
   */
  async deleteVoteQuestion(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(VoteQuestion, id);
    if (!deleteResponse.affected) {
      throw new VoteQuestionNotFoundException(id);
    }
  }
}
