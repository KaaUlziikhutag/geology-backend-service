import { Injectable } from '@nestjs/common';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { EntityManager } from 'typeorm';
import State from './entities/state.entity';
import StateNotFoundException from './exceptions/state-not-found.exception';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../cloud/user/dto/get-user.dto';

@Injectable()
export class StateService {
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
   * A method that fetches a State with a given id. Example:
   *
   * @example
   * const state = await StateService.getStateById(1);
   */
  async getStateById(stateId: number, user: GetUserDto): Promise<State> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const state = await entityManager.findOne(State, {
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
  async createState(state: CreateStateDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newState = entityManager.create(State, state);
    await entityManager.save(newState);
    return newState;
  }

  /**
   * See the [definition of the UpdateStateDto file]{@link UpdateStateDto} to see a list of required properties
   */
  async updateState(
    id: number,
    user: GetUserDto,
    state: UpdateStateDto,
  ): Promise<State> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(State, id, state);
    const updatedState = await entityManager.findOne(State, {
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
  async deleteStateById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteState(id, user);
  }

  /**
   * A method that deletes a state from the database
   * @param id An id of a state. A state with this id should exist in the database
   */
  async deleteState(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(State, id);
    if (!deleteResponse.affected) {
      throw new StateNotFoundException(id);
    }
  }
}
