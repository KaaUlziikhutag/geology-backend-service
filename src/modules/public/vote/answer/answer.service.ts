import { Injectable } from '@nestjs/common';
import { CreateVoteAnswerDto } from './dto/create-answer.dto';
import { UpdateVoteAnswerDto } from './dto/update-answer.dto';
import { GetVoteAnswerDto } from './dto/get-answer.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import VoteAnswer from './answer.entity';
import VoteAnswerNotFoundException from './exceptions/answer-not-found.exception';
import { PageDto } from '../../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../cloud/user/dto/get-user.dto';

@Injectable()
export class VoteAnswerService {
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
  async getAllVoteAnswer(query: GetVoteAnswerDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<VoteAnswer>['where'] = {};
    if (query.questionId) {
      where.questionId = Equal(query.questionId);
    }
    if (query.userId) {
      where.userId = Equal(query.userId);
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
    const [items, count] = await entityManager.findAndCount(VoteAnswer, {
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
  async getVoteAnswerById(
    voteId: number,
    user: GetUserDto,
  ): Promise<VoteAnswer> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const vote = await entityManager.findOne(VoteAnswer, {
      where: { id: voteId },
      relations: ['voteQuestion'],
    });
    if (vote) {
      return vote;
    }
    throw new VoteAnswerNotFoundException(voteId);
  }

  /**
   *
   * @param SystemMail createSystemMail
   *
   */
  async createVoteAnswer(voteAnswer: CreateVoteAnswerDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    voteAnswer.userId = user.workerId;
    const newVote = entityManager.create(VoteAnswer, voteAnswer);
    await entityManager.save(newVote);
    return newVote;
  }

  /**
   * See the [definition of the UpdateContractDto file]{@link UpdateSystemMailDto} to see a list of required properties
   */
  async updateVoteAnswer(
    id: number,
    user: GetUserDto,
    voteAnswer: UpdateVoteAnswerDto,
  ): Promise<VoteAnswer> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(VoteAnswer, id, voteAnswer);
    const updatedVote = await entityManager.findOne(VoteAnswer, {
      where: { id: id },
    });
    if (updatedVote) {
      return updatedVote;
    }
    throw new VoteAnswerNotFoundException(id);
  }

  /**
   * @deprecated Use deleteContract instead
   */
  async deleteVoteAnswerById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteVoteAnswer(id, user);
  }

  /**
   * A method that deletes a contract from the database
   * @param id An id of a contract. A contract with this id should exist in the database
   */
  async deleteVoteAnswer(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(VoteAnswer, id);
    if (!deleteResponse.affected) {
      throw new VoteAnswerNotFoundException(id);
    }
  }
}
