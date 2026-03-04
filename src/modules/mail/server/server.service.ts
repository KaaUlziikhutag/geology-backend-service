import { Injectable } from '@nestjs/common';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { GetServerDto } from './dto/get-server.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Server from './server.entity';
import ServerNotFoundException from './exceptions/server-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/users/interface/user.interface';

@Injectable()
export class ServerService {
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
  async getAllServers(query: GetServerDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Server>['where'] = {};
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
        : undefined;
    const skip = limit ? (page - 1) * limit : undefined;
    const [items, count] = await entityManager.findAndCount(Server, {
      where,
      order: {
        createdAt: 'DESC',
      },
      relations: ['connUser'],
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
  async getServerById(serverId: number, user: IUser): Promise<Server> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const server = await entityManager.findOne(Server, {
      where: { id: serverId },
    });
    if (server) {
      return server;
    }
    throw new ServerNotFoundException(serverId);
  }

  /**
   *
   * @param SystemMail createSystemMail
   *
   */
  async createServer(server: CreateServerDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    server.authorId = user.id;
    const newServer = entityManager.create(Server, server);
    await entityManager.save(newServer);
    return newServer;
  }

  /**
   * See the [definition of the UpdateContractDto file]{@link UpdateSystemMailDto} to see a list of required properties
   */
  async updateServer(
    id: number,
    user: IUser,
    server: UpdateServerDto,
  ): Promise<Server> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Server, id, server);
    const updatedServer = await entityManager.findOne(Server, {
      where: { id: id },
    });
    if (updatedServer) {
      return updatedServer;
    }
    throw new ServerNotFoundException(id);
  }

  /**
   * @deprecated Use deleteContract instead
   */
  async deleteServerById(id: number, user: IUser): Promise<void> {
    return this.deleteServer(id, user);
  }

  /**
   * A method that deletes a contract from the database
   * @param id An id of a contract. A contract with this id should exist in the database
   */
  async deleteServer(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(Server, id);
    if (!deleteResponse.affected) {
      throw new ServerNotFoundException(id);
    }
  }
}
