import { Injectable } from '@nestjs/common';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import { GetAccessDto } from './dto/get-access.dto';
import { getEntityManagerToken, InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  Equal,
  FindManyOptions,
  Not,
  Repository,
} from 'typeorm';
import Access from './access.entity';
import AccessNotFoundException from './exceptions/access-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { ProgramService } from '../../cloud/programs/program.service';
import { ModuleService } from '../../cloud/module/modules.service';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class AccessService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(Access)
    private accessRepository: Repository<Access>,
    private readonly programService: ProgramService,
    private readonly modulService: ModuleService,
  ) {}

  /**
   * A method that fetches the Access from the database
   * @returns A promise with the list of Accesss
   */
  async getAllAccesss(query: GetAccessDto) {
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

    const [items, count] = await this.accessRepository.findAndCount({
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
  async getAccessById(accessId: number): Promise<Access> {
    const access = await this.accessRepository.findOne({
      where: { id: accessId },
    });
    if (access) {
      return access;
    }
    throw new AccessNotFoundException(accessId);
  }

  async getAccessByWorkId(workerId: number): Promise<any[]> {
    try {
      const accessList = await this.accessRepository.find({
        where: { workerId: workerId, modId: 0 },
      });
      const programs = [];
      await Promise.all(
        accessList.map(async (access) => {
          const program = await this.programService.getProgramById(
            access.proId,
          );
          const modules = [];

          const modeleList = await this.accessRepository.find({
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
  async createAccess(access: CreateAccessDto) {
    const newAccess = this.accessRepository.create(access);
    return await this.accessRepository.save(newAccess);
  }

  /**
   * See the [definition of the UpdateAccessDto file]{@link UpdateAccessDto} to see a list of required properties
   */
  async updateAccess(id: number, access: UpdateAccessDto): Promise<Access> {
    await this.accessRepository.update(id, access);
    const updatedAccess = await this.accessRepository.findOne({
      where: { id },
    });
    if (updatedAccess) {
      return updatedAccess;
    }
    throw new AccessNotFoundException(id);
  }

  async updateAccessProgram(
    id: number,
    access: UpdateAccessDto,
  ): Promise<Access[]> {
    const existingAccessRecords = await this.accessRepository.find({
      where: { workerId: id, proId: access.accessId },
    });
    if (!existingAccessRecords.length) {
      throw new AccessNotFoundException(access.accessId);
    }
    const updatedAccessRecords: Access[] = [];
    for (const existingAccess of existingAccessRecords) {
      existingAccess.access = access.accessType;
      await this.accessRepository.save(existingAccess);
      updatedAccessRecords.push(existingAccess);
    }
    return updatedAccessRecords;
  }

  async updateAccessModule(access: UpdateAccessDto): Promise<Access[]> {
    const existingAccessRecords = await this.accessRepository.find({
      where: { id: access.accessId },
    });
    if (!existingAccessRecords.length) {
      throw new AccessNotFoundException(access.accessId);
    }
    const updatedAccessRecords: Access[] = [];

    for (const existingAccess of existingAccessRecords) {
      existingAccess.access = access.accessType;
      await this.accessRepository.save(existingAccess);
      updatedAccessRecords.push(existingAccess);
    }
    return updatedAccessRecords;
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteAccess(id: number, user: IUser): Promise<void> {
    const deleteResponse = await this.accessRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new AccessNotFoundException(id);
    }
  }
}
