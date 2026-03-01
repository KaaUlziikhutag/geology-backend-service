import { Injectable } from '@nestjs/common';
import { CreateGraphicDto } from './dto/create-graphic.dto';
import { UpdateGraphicDto } from './dto/update-graphic.dto';
import { GetGraphicDto } from './dto/get-graphic.dto';
import { EntityManager, FindManyOptions, ILike } from 'typeorm';
import Graphic from './entity/graphic.entity';
import GraphicNotFoundException from './exceptions/graphic-not-found.exception';
import { PageDto } from '../../../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../../cloud/user/dto/get-user.dto';
import GraphicStep from './entity/step.entity';

@Injectable()
export class GraphicService {
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
   * A method that fetches the IpSetting from the database
   * @returns A promise with the list of IpSettings
   */
  async getAllGraphic(query: GetGraphicDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Graphic>['where'] = {};
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
    const [items, count] = await entityManager.findAndCount(Graphic, {
      where,
      relations: ['graphicStep'],
      order: {
        graphicStep: {
          position: 'ASC',
        },
      },
      skip: skip,
      take: limit,
    });
    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a IpSetting with a given id. Example:
   *
   * @example
   */
  async getGraphicId(graphicId: number, user: GetUserDto): Promise<Graphic> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const graphic = await entityManager.findOne(Graphic, {
      where: { id: graphicId },
      relations: ['graphicStep'],
    });
    if (graphic) {
      return graphic;
    }
    throw new GraphicNotFoundException(graphicId);
  }

  async getGraphicStepId(
    graphicStepId: number,
    user: GetUserDto,
  ): Promise<GraphicStep> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const graphicStep = await entityManager.findOne(GraphicStep, {
      where: { id: graphicStepId },
    });
    if (graphicStep) {
      return graphicStep;
    }
    throw new GraphicNotFoundException(graphicStepId);
  }

  /**
   *
   * @param Graphic createGraphic
   *
   */
  async createGraphic(graphic: CreateGraphicDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    let newGraphic = entityManager.create(Graphic, graphic);
    newGraphic.autorId = user.workerId;
    newGraphic = await entityManager.save(newGraphic);
    if (graphic.steps) {
      for (const step of graphic.steps) {
        const newStep = entityManager.create(GraphicStep, {
          ...step,
          graphicId: newGraphic.id,
        });
        await entityManager.save(newStep);
      }
    }
    return newGraphic;
  }

  /**
   * See the [definition of the UpdateIpSettingDto file]{@link UpdateGraphicDto} to see a list of required properties
   */
  async updateGraphic(
    id: number,
    user: GetUserDto,
    graphic: UpdateGraphicDto,
  ): Promise<Graphic> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const { steps, ...graphicData } = graphic;
    if (Object.keys(graphicData).length > 0) {
      await entityManager.update(Graphic, id, graphicData);
    }
    const updatedGraphic = await entityManager.findOne(Graphic, {
      where: { id },
    });
    if (!updatedGraphic) {
      throw new GraphicNotFoundException(id);
    }
    if (steps) {
      await entityManager.delete(GraphicStep, { graphicId: id });
      for (const step of steps) {
        const newStep = entityManager.create(GraphicStep, {
          ...step,
          graphicId: id,
        });
        await entityManager.save(newStep);
      }
    }
    return updatedGraphic;
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteGraphic(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.softDelete(Graphic, id);
    if (!deleteResponse.affected) {
      throw new GraphicNotFoundException(id);
    }
  }
}
