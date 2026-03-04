import { Injectable } from '@nestjs/common';
import { CreateLegalActDto } from './dto/create-legal-act.dto';
import { UpdateLegalActDto } from './dto/update-legal-act.dto';
import { GetLegalActDto } from './dto/get-legal-act.dto';
import { EntityManager, FindManyOptions, ILike } from 'typeorm';
import LegalAct from './legal-act.entity';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import IUser from '@modules/users/interface/user.interface';
import LegalActNotFoundException from './exceptions/legal-act-not-found.exception';

@Injectable()
export class DecisionLegalActService {
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
   * A method that fetches the LegalAct from the database
   * @returns A promise with the list of LegalAct
   */
  async getAllLegalActs(query: GetLegalActDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<LegalAct>['where'] = {};
    if (query.name) {
      where.name = ILike('%' + query.name + '%');
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
    const [items, count] = await entityManager.findAndCount(LegalAct, {
      where,
      order: {
        createdAt: 'DESC',
      },
      skip: skip,
      take: limit,
    });
    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a LegalAct with a given id. Example:
   *
   * @example
   * const LegalAct = await LegalActService.getCategoryById(1);
   */
  async getLegalActById(legalActId: number, user: IUser): Promise<LegalAct> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const legalAct = await entityManager.findOne(LegalAct, {
      where: { id: legalActId },
    });
    if (legalAct) {
      return legalAct;
    }
    throw new LegalActNotFoundException(legalActId);
  }

  /**
   *
   * @param LegalAct createLegalAct
   *
   */
  async createLegalAct(legalAct: CreateLegalActDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    legalAct.comId = null;
    const newLegalAct = entityManager.create(LegalAct, legalAct);
    await entityManager.save(newLegalAct);
    return newLegalAct;
  }

  /**
   * See the [definition of the UpdateLegalActDto file]{@link UpdateLegalActDto} to see a list of required properties
   */
  async updateLegalAct(
    id: number,
    user: IUser,
    legalAct: UpdateLegalActDto,
  ): Promise<LegalAct> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(LegalAct, id, legalAct);
    const updatedLegalAct = await entityManager.findOne(LegalAct, {
      where: { id: id },
    });
    if (updatedLegalAct) {
      return updatedLegalAct;
    }
    throw new LegalActNotFoundException(id);
  }

  /**
   * @deprecated Use deleteLegalAct instead
   */
  async deleteLegalActById(id: number, user: IUser): Promise<void> {
    return this.deleteLegalAct(id, user);
  }

  /**
   * A method that deletes a LegalAct from the database
   * @param id An id of a LegalAct. A LegalAct with this id should exist in the database
   */
  async deleteLegalAct(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(LegalAct, id);
    if (!deleteResponse.affected) {
      throw new LegalActNotFoundException(id);
    }
  }
}
