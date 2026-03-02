import { Injectable } from '@nestjs/common';
import { CreateVoteAnswerDto } from './dto/create-answer.dto';
import { UpdateVoteAnswerDto } from './dto/update-answer.dto';
import { GetVoteAnswerDto } from './dto/get-answer.dto';
import { EntityManager, Equal, FindManyOptions, Repository } from 'typeorm';
import VoteAnswer from './answer.entity';
import VoteAnswerNotFoundException from './exceptions/answer-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken, InjectRepository } from '@nestjs/typeorm';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class VoteAnswerService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(VoteAnswer)
    private readonly voteAnswerRepository: Repository<VoteAnswer>,
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
  async getAllVoteAnswer(query: GetVoteAnswerDto) {
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
    const [items, count] = await this.voteAnswerRepository.findAndCount({
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
  async getVoteAnswerById(voteId: number): Promise<VoteAnswer> {
    const vote = await this.voteAnswerRepository.findOne({
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
  async createVoteAnswer(voteAnswer: CreateVoteAnswerDto, user: IUser) {
    voteAnswer.userId = user.id;
    const newVote = this.voteAnswerRepository.create(voteAnswer);
    return await this.voteAnswerRepository.save(newVote);
  }

  /**
   * See the [definition of the UpdateContractDto file]{@link UpdateSystemMailDto} to see a list of required properties
   */
  async updateVoteAnswer(
    id: number,
    voteAnswer: UpdateVoteAnswerDto,
  ): Promise<VoteAnswer> {
    await this.voteAnswerRepository.update(id, voteAnswer);
    const updatedVote = await this.voteAnswerRepository.findOne({
      where: { id },
    });
    if (updatedVote) {
      return updatedVote;
    }
    throw new VoteAnswerNotFoundException(id);
  }

  /**
   * @deprecated Use deleteContract instead
   */
  async deleteVoteAnswerById(id: number): Promise<void> {
    return this.deleteVoteAnswer(id);
  }

  /**
   * A method that deletes a contract from the database
   * @param id An id of a contract. A contract with this id should exist in the database
   */
  async deleteVoteAnswer(id: number): Promise<void> {
    const deleteResponse = await this.voteAnswerRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new VoteAnswerNotFoundException(id);
    }
  }
}
