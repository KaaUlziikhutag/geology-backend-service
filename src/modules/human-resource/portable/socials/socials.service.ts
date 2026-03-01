import { Injectable } from '@nestjs/common';
import { CreateSocialsDto } from './dto/create-socials.dto';
import { UpdateSocialsDto } from './dto/update-socials.dto';
import { GetSocialsDto } from './dto/get-socials.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Socials from './socials.entity';
import SocialsNotFoundException from './exceptions/socials-not-found.exception';
import { PageDto } from '../../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../cloud/user/dto/get-user.dto';

@Injectable()
export class SocialsService {
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
   * A method that fetches the Socials from the database
   * @returns A promise with the list of Socialss
   */
  async getAllSocialss(query: GetSocialsDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Socials>['where'] = {};
    if (query.authorId) {
      where.authorId = Equal(query.authorId);
    }
    if (query.userId) {
      where.userId = Equal(query.userId);
    }
    if (query.unit) {
      where.unit = Equal(query.unit);
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

    const [items, count] = await entityManager.findAndCount(Socials, {
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
   * A method that fetches a Socials with a given id. Example:
   *
   * @example
   * const Socials = await SocialsService.getSocialsById(1);
   */
  async getSocialsById(mistakesId: number, user: GetUserDto): Promise<Socials> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const mistakes = await entityManager.findOne(Socials, {
      where: { id: mistakesId },
    });
    if (mistakes) {
      return mistakes;
    }
    throw new SocialsNotFoundException(mistakesId);
  }

  /**
   *
   * @param socials createSocials
   *
   */
  async createSocials(socials: CreateSocialsDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    socials.authorId = user.workerId;
    const newSocials = entityManager.create(Socials, socials);
    await entityManager.save(newSocials);
    return newSocials;
  }

  /**
   * See the [definition of the UpdateSocialsDto file]{@link UpdateSocialsDto} to see a list of required properties
   */
  async updateSocials(
    id: number,
    user: GetUserDto,
    socials: UpdateSocialsDto,
  ): Promise<Socials> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Socials, id, socials);
    const updatedSocials = await entityManager.findOne(Socials, {
      where: { id: id },
    });
    if (updatedSocials) {
      return updatedSocials;
    }
    throw new SocialsNotFoundException(id);
  }

  /**
   * @deprecated Use deleteSocials instead
   */
  async deleteSocialsById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteSocials(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteSocials(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Socials, id);
    if (!deleteResponse.affected) {
      throw new SocialsNotFoundException(id);
    }
  }
}
