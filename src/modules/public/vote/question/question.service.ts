import { Injectable } from '@nestjs/common';
import { CreateVoteQuestionDto } from './dto/create-question.dto';
import { UpdateVoteQuestionDto } from './dto/update-question.dto';
import { GetVoteQuestionDto } from './dto/get-question.dto';
import { EntityManager, Equal, FindManyOptions, Repository } from 'typeorm';
import VoteQuestion from './question.entity';
import VoteQuestionNotFoundException from './exceptions/question-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken, InjectRepository } from '@nestjs/typeorm';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class VoteQuestionService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(VoteQuestion)
    private readonly voteQuestionRepository: Repository<VoteQuestion>,
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
  async getAllVoteQuestion(query: GetVoteQuestionDto) {
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
    const [items, count] = await this.voteQuestionRepository.findAndCount({
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
  async getVoteQuestionById(voteId: number): Promise<VoteQuestion> {
    const vote = await this.voteQuestionRepository.findOne({
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
  async createVoteQuestion(vote: CreateVoteQuestionDto, user: IUser) {
    vote.authorId = user.id;
    const newVote = this.voteQuestionRepository.create(vote);
    return await this.voteQuestionRepository.save(newVote);
  }

  /**
   * See the [definition of the UpdateContractDto file]{@link UpdateSystemMailDto} to see a list of required properties
   */
  async updateVoteQuestion(
    id: number,
    vote: UpdateVoteQuestionDto,
  ): Promise<VoteQuestion> {
    await this.voteQuestionRepository.update(id, vote);
    const updatedVote = await this.voteQuestionRepository.findOne({
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
  async deleteVoteQuestionById(id: number): Promise<void> {
    return this.deleteVoteQuestion(id);
  }

  /**
   * A method that deletes a contract from the database
   * @param id An id of a contract. A contract with this id should exist in the database
   */
  async deleteVoteQuestion(id: number): Promise<void> {
    const deleteResponse = await this.voteQuestionRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new VoteQuestionNotFoundException(id);
    }
  }
}
