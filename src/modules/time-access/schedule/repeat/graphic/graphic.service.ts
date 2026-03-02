import { Injectable } from '@nestjs/common';
import { CreateGraphicDto } from './dto/create-graphic.dto';
import { UpdateGraphicDto } from './dto/update-graphic.dto';
import { GetGraphicDto } from './dto/get-graphic.dto';
import { EntityManager, FindManyOptions, ILike, Repository } from 'typeorm';
import Graphic from './entity/graphic.entity';
import GraphicNotFoundException from './exceptions/graphic-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken, InjectRepository } from '@nestjs/typeorm';
import GraphicStep from './entity/step.entity';

@Injectable()
export class GraphicService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(Graphic)
    private readonly graphicRepository: Repository<Graphic>,
    private moduleRef: ModuleRef,
  ) {}

  private async loadEntityManager(systemId: string): Promise<EntityManager> {
    return this.moduleRef.get(getEntityManagerToken(`ioffice_${systemId}`), {
      strict: false,
    });
  }

  /**
   * A method that fetches the IpSetting from the database
   * @returns A promise with the list of IpSettings
   */
  async getAllGraphic(query: GetGraphicDto) {
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
    const [items, count] = await this.graphicRepository.findAndCount({
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
  async getGraphicId(graphicId: number): Promise<Graphic> {
    const graphic = await this.graphicRepository.findOne({
      where: { id: graphicId },
      relations: ['graphicStep'],
    });
    if (graphic) {
      return graphic;
    }
    throw new GraphicNotFoundException(graphicId);
  }

  async getGraphicStepId(graphicStepId: number): Promise<GraphicStep> {
    const graphicStep = await this.graphicRepository.manager.findOne(
      GraphicStep,
      {
        where: { id: graphicStepId },
      },
    );
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
  async createGraphic(graphic: CreateGraphicDto) {
    let newGraphic = this.graphicRepository.create(graphic);
    // newGraphic.autorId = user.workerId;
    newGraphic = await this.graphicRepository.save(newGraphic);
    if (graphic.steps) {
      for (const step of graphic.steps) {
        const newStep = this.graphicRepository.manager.create(GraphicStep, {
          ...step,
          graphicId: newGraphic.id,
        });
        await this.graphicRepository.manager.save(newStep);
      }
    }
    return newGraphic;
  }

  /**
   * See the [definition of the UpdateIpSettingDto file]{@link UpdateGraphicDto} to see a list of required properties
   */
  async updateGraphic(id: number, graphic: UpdateGraphicDto): Promise<Graphic> {
    const { steps, ...graphicData } = graphic;
    if (Object.keys(graphicData).length > 0) {
      await this.graphicRepository.update(id, graphicData);
    }
    const updatedGraphic = await this.graphicRepository.findOne({
      where: { id },
    });
    if (!updatedGraphic) {
      throw new GraphicNotFoundException(id);
    }
    if (steps) {
      await this.graphicRepository.manager.delete(GraphicStep, {
        graphicId: id,
      });
      for (const step of steps) {
        const newStep = this.graphicRepository.manager.create(GraphicStep, {
          ...step,
          graphicId: id,
        });
        await this.graphicRepository.manager.save(newStep);
      }
    }
    return updatedGraphic;
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteGraphic(id: number): Promise<void> {
    const deleteResponse = await this.graphicRepository.softDelete(id);
    if (!deleteResponse.affected) {
      throw new GraphicNotFoundException(id);
    }
  }
}
