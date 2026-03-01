import { Injectable } from '@nestjs/common';
import { CreateModuleDto } from './dto/create-modules.dto';
import { UpdateModuleDto } from './dto/update-modules.dto';
import { GetModuleDto } from './dto/get-modules.dto';
import { Equal, FindManyOptions, Repository } from 'typeorm';
import Modules from './modules.entity';
import ModuleNotFoundException from './exceptions/modules-not-found.exception';
import { PageDto } from '../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../utils/dto/pageMeta.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ModuleService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(Modules)
    private modulesRepository: Repository<Modules>,
  ) {}

  /**
   * A method that fetches the Module from the database
   * @returns A promise with the list of Modules
   */
  async getAllModules(query: GetModuleDto) {
    const where: FindManyOptions<Modules>['where'] = {};
    if (query.pos) {
      where.pos = Equal(query.pos);
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
    const [items, count] = await this.modulesRepository.findAndCount({
      where,
      order: {
        pos: 'ASC',
      },
      skip: skip,
      take: limit,
    });
    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  async getAllMoule() {
    const modules = await this.modulesRepository.find();
    return modules;
  }
  /**
   * A method that fetches a Module with a given id. Example:
   *
   * @example
   * const Module = await ModuleService.getModuleById(1);
   */
  async getModuleById(moduleId: number): Promise<Modules> {
    const module = await this.modulesRepository.findOne({
      where: { id: moduleId },
    });
    if (module) {
      return module;
    }
    throw new ModuleNotFoundException(moduleId);
  }

  /**
   *
   * @param Module createModule
   *
   */
  async createModule(module: CreateModuleDto) {
    const newModule = this.modulesRepository.create(module);
    await this.modulesRepository.save(newModule);
    return newModule;
  }

  /**
   * See the [definition of the UpdateModuleDto file]{@link UpdateModuleDto} to see a list of required properties
   */
  async updateModule(id: number, module: UpdateModuleDto): Promise<Modules> {
    await this.modulesRepository.update(id, module);
    const updatedModule = await this.modulesRepository.findOne({
      where: { id: id },
    });
    if (updatedModule) {
      return updatedModule;
    }
    throw new ModuleNotFoundException(id);
  }

  /**
   * @deprecated Use deleteModule instead
   */
  async deleteModuleById(id: number): Promise<void> {
    return this.deleteModule(id);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteModule(id: number): Promise<void> {
    const deleteResponse = await this.modulesRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new ModuleNotFoundException(id);
    }
  }
}
