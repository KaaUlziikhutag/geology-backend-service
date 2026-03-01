import { Injectable } from '@nestjs/common';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import { GetAccessDto } from './dto/get-access.dto';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager, Equal, FindManyOptions, Not } from 'typeorm';
import Access from './access.entity';
import AccessNotFoundException from './exceptions/access-not-found.exception';
import { PageDto } from '../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import GetUserDto from '../../cloud/user/dto/get-user.dto';
import { ProgramService } from '../../cloud/programs/program.service';
import { ModuleService } from '../../cloud/module/modules.service';

@Injectable()
export class AccessService {
  /**
   * @ignore
   */
  constructor(
    private moduleRef: ModuleRef,
    private readonly programService: ProgramService,
    private readonly modulService: ModuleService,
  ) {}

  private async loadEntityManager(systemId: string): Promise<EntityManager> {
    return this.moduleRef.get(getEntityManagerToken(`ioffice_${systemId}`), {
      strict: false,
    });
  }

  /**
   * A method that fetches the Access from the database
   * @returns A promise with the list of Accesss
   */
  async getAllAccesss(query: GetAccessDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Access>['where'] = {};

    if (query.workerId) {
      where.workerId = Equal(query.workerId);
    }
    const page =
      query.page && !isNaN(query.page) && query.page > 0
        ? Number(query.page)
        : 1;

    let limit: number | undefined;

    if (query.limit && !isNaN(query.limit) && query.limit > 0) {
      limit = Number(query.limit);
    }

    const skip = (page - 1) * (limit || 0);

    const [items, count] = await entityManager.findAndCount(Access, {
      where,
      order: {
        createdAt: 'DESC',
      },
      skip,
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
  async getAccessById(accessId: number, user: GetUserDto): Promise<Access> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const access = await entityManager.findOne(Access, {
      where: { id: accessId },
    });
    if (access) {
      return access;
    }
    throw new AccessNotFoundException(accessId);
  }

  async getAccessByWorkId(workerId: number, user: GetUserDto): Promise<any[]> {
    try {
      const entityManager = await this.loadEntityManager(user.dataBase);
      const accessList = await entityManager.find(Access, {
        where: { workerId: workerId, modId: 0 },
      });
      const programs = [];
      await Promise.all(
        accessList.map(async (access) => {
          const program = await this.programService.getProgramById(
            access.proId,
          );
          const modules = [];

          const modeleList = await entityManager.find(Access, {
            where: { workerId: workerId, proId: access.proId, modId: Not(0) },
          });

          await Promise.all(
            modeleList.map(async (module) => {
              const mod = await this.modulService.getModuleById(module.modId);
              const modItem = {
                id: module.id,
                title: mod.title,
                access: module.access,
                pos: mod.pos,
              };
              modules.push(modItem);
            }),
          );

          const item = {
            id: program.id,
            accessId: access.id,
            name: program.title,
            intro: program.intro,
            access: access.access,
            modules: modules,
            pos: program.pos,
          };

          programs.push(item);
        }),
      );

      programs.sort((a, b) => a.pos - b.pos);
      return programs;
    } catch (error) {
      console.error(`Error fetching access for workerId ${workerId}:`, error);
      throw new Error(`Failed to get access by work ID: ${workerId}`);
    }
  }

  /**
   *
   * @param Access createAccess
   *
   */
  async createAccess(access: CreateAccessDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newAccess = entityManager.create(Access, access);
    await entityManager.save(newAccess);
    return newAccess;
  }

  /**
   * See the [definition of the UpdateAccessDto file]{@link UpdateAccessDto} to see a list of required properties
   */
  async updateAccess(
    id: number,
    user: GetUserDto,
    access: UpdateAccessDto,
  ): Promise<Access> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Access, id, access);
    const updatedAccess = await entityManager.findOne(Access, {
      where: { id: id },
    });
    if (updatedAccess) {
      return updatedAccess;
    }
    throw new AccessNotFoundException(id);
  }

  async updateAccessProgram(
    id: number,
    user: GetUserDto,
    access: UpdateAccessDto,
  ): Promise<Access[]> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const existingAccessRecords = await entityManager.find(Access, {
      where: { workerId: id, proId: access.accessId },
    });
    if (!existingAccessRecords.length) {
      throw new AccessNotFoundException(access.accessId);
    }
    const updatedAccessRecords: Access[] = [];
    for (const existingAccess of existingAccessRecords) {
      existingAccess.access = access.accessType;
      await entityManager.save(Access, existingAccess);
      updatedAccessRecords.push(existingAccess);
    }
    return updatedAccessRecords;
  }

  async updateAccessModule(
    id: number,
    user: GetUserDto,
    access: UpdateAccessDto,
  ): Promise<Access[]> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const existingAccessRecords = await entityManager.find(Access, {
      where: { id: access.accessId },
    });
    if (!existingAccessRecords.length) {
      throw new AccessNotFoundException(access.accessId);
    }
    const updatedAccessRecords: Access[] = [];

    for (const existingAccess of existingAccessRecords) {
      existingAccess.access = access.accessType;
      await entityManager.save(Access, existingAccess);
      updatedAccessRecords.push(existingAccess);
    }
    return updatedAccessRecords;
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteAccess(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(Access, id);
    if (!deleteResponse.affected) {
      throw new AccessNotFoundException(id);
    }
  }
}
