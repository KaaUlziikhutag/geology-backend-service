import { Injectable } from '@nestjs/common';
import { CreateHumanDto } from './dto/create-human.dto';
import { UpdateHumanDto } from './dto/update-human.dto';
import { GetHumanDto } from './dto/get-human.dto';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager, Equal, FindManyOptions, ILike } from 'typeorm';
import Human from './human.entity';
import HumanNotFoundException from './exceptions/human-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import IUser from '@modules/cloud/user/interface/user.interface';
import { CountryService } from '../../../cloud/country/country.service';

@Injectable()
export class HumanService {
  /**
   * @ignore
   */
  constructor(
    private moduleRef: ModuleRef,
    private readonly countryService: CountryService,
  ) {}

  private async loadEntityManager(systemId: string): Promise<EntityManager> {
    return this.moduleRef.get(getEntityManagerToken(`ioffice_${systemId}`), {
      strict: false,
    });
  }

  /**
   * A method that fetches the Human from the database
   * @returns A promise with the list of Humans
   */
  async getAllHumans(user: IUser, query: GetHumanDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Human>['where'] = {};

    if (query.regNumber) {
      where.regNumber = ILike('%' + query.regNumber + '%');
    }

    if (query.workerId) {
      where.workers = {
        id: Equal(query.workerId),
      };
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

    const [items, count] = await entityManager.findAndCount(Human, {
      where,
      order: { createdAt: 'DESC' },
      relations: ['workers.depTree', 'workers.appTree'],
      skip,
      take: limit,
    });
    const enhancedItems = await Promise.all(
      items.map(async (item) => {
        if (item.region) {
          const country = await this.countryService.getCountryById(item.region);
          return {
            ...item,
            workers: {
              ...item.workers,
              countryName: country?.name || 'Unknown',
            },
          };
        }
        return item;
      }),
    );

    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });

    return new PageDto(enhancedItems, pageMetaDto);
  }

  /**
   * A method that fetches a Human with a given id. Example:
   *
   * @example
   * const Human = await HumanService.getHumanById(1);
   */
  async getHumanById(user: IUser, humanId: number): Promise<Human> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const human = await entityManager.findOne(Human, {
      where: { id: humanId },
    });
    if (human) {
      return human;
    }
    throw new HumanNotFoundException(humanId);
  }

  /**
   *
   * @param Human createHuman
   *
   */
  async createHuman(user: IUser, human: CreateHumanDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newHuman = entityManager.create(Human, human);
    await entityManager.save(newHuman);
    return newHuman;
  }

  /**
   * See the [definition of the UpdateHumanDto file]{@link UpdateHumanDto} to see a list of required properties
   */
  async updateHuman(
    id: number,
    user: IUser,
    human: UpdateHumanDto,
  ): Promise<Human> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Human, id, human);
    const updatedHuman = await entityManager.findOne(Human, {
      where: { id: id },
    });
    if (updatedHuman) {
      return updatedHuman;
    }
    throw new HumanNotFoundException(id);
  }

  /**
   * @deprecated Use deleteHuman instead
   */
  async deleteHumanById(id: number, user: IUser): Promise<void> {
    return this.deleteHuman(user, id);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteHuman(user: IUser, id: number): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(Human, id);
    if (!deleteResponse.affected) {
      throw new HumanNotFoundException(id);
    }
  }
}
