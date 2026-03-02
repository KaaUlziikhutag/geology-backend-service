import { Injectable } from '@nestjs/common';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { EntityManager, Repository } from 'typeorm';
import State from './entities/state.entity';
import StateNotFoundException from './exceptions/state-not-found.exception';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken, InjectRepository } from '@nestjs/typeorm';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class StateService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
    private moduleRef: ModuleRef,
  ) {}

  private async loadEntityManager(systemId: string): Promise<EntityManager> {
    return this.moduleRef.get(getEntityManagerToken(`ioffice_${systemId}`), {
      strict: false,
    });
  }

  /**
   * A method that fetches a State with a given id. Example:
   *
   * @example
   * const state = await StateService.getStateById(1);
   */
  async getStateById(stateId: number): Promise<State> {
    const state = await this.stateRepository.findOne({
      where: { id: stateId },
    });
    if (state) {
      return state;
    }
    throw new StateNotFoundException(stateId);
  }

  /**
   *
   * @param state CreateStateDto
   *
   */
  async createState(state: CreateStateDto) {
    const newState = this.stateRepository.create(state);
    return await this.stateRepository.save(newState);
  }

  /**
   * See the [definition of the UpdateStateDto file]{@link UpdateStateDto} to see a list of required properties
   */
  async updateState(
    id: number,
    user: IUser,
    state: UpdateStateDto,
  ): Promise<State> {
    await this.stateRepository.update(id, state);
    const updatedState = await this.stateRepository.findOne({
      where: { id: id },
    });
    if (updatedState) {
      return updatedState;
    }
    throw new StateNotFoundException(id);
  }

  /**
   * @deprecated Use deleteState instead
   */
  async deleteStateById(id: number): Promise<void> {
    return this.deleteState(id);
  }

  /**
   * A method that deletes a state from the database
   * @param id An id of a state. A state with this id should exist in the database
   */
  async deleteState(id: number): Promise<void> {
    const deleteResponse = await this.stateRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new StateNotFoundException(id);
    }
  }
}
