import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTreeDto } from './dto/create-tree.dto';
import { UpdateTreeDto } from './dto/update-tree.dto';
import { GetTreeDto } from './dto/get-tree.dto';
import { getEntityManagerToken, InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  Equal,
  FindManyOptions,
  ILike,
  Repository,
} from 'typeorm';
import Trees from './tree.entity';
import TreeNotFoundException from './exceptions/tree-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import Worker from '../member/worker/worker.entity';
import IUser from '@modules/users/interface/user.interface';

@Injectable()
export class TreeService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(Trees)
    private readonly treeRepository: Repository<Trees>,
  ) {}

  /**
   * A method that fetches the companies from the database
   * @returns A promise with the list of Trees
   */
  async getAllTrees(query: GetTreeDto, user: IUser) {
    const where: FindManyOptions<Trees>['where'] = {};
    if (query.name) {
      where.name = ILike('%' + query.name + '%');
    }

    if (query.type) {
      where.type = Equal(query.type);
    }

    const trees = await this.treeRepository.find({
      where,
      order: {
        createdAt: 'ASC',
      },
      relations: ['occupations'],
    });
    function buildTree(treeList, parentId = null) {
      const children = treeList
        .filter((tree: any) => tree.mid === parentId)
        .map((tree: any) => {
          const childNodes = buildTree(treeList, tree.id);
          const childPositionSum = childNodes
            ? childNodes.reduce(
                (sum, child) => sum + (child.positionSum || 0),
                0,
              )
            : 0;

          const positionSum = tree.position + childPositionSum;

          return {
            id: tree.id,
            mid: parentId,
            name: tree.name,
            type: tree.type,
            shortName: tree.shortName,
            isActive: tree.isActive,
            date: tree.date,
            workDuty: tree.workDuty,
            typeOfPosition: tree.typeOfPosition,
            situation: tree.situation,
            position: tree.position,
            departmentType: tree.departmentType,
            totalNumber: tree.totalNumber,
            occupations: tree.occupations,
            positionSum, // Нийлбэрийг энд нэмнэ
            children: childNodes,
          };
        });

      return children.length > 0 ? children : null;
    }

    const hierarchicalTreeData = buildTree(trees, null);
    const itemCount = hierarchicalTreeData ? hierarchicalTreeData.length : 0;
    const pageMetaDto = new PageMetaDto({
      page: 1,
      limit: itemCount,
      itemCount,
    });

    return new PageDto(hierarchicalTreeData, pageMetaDto);
  }

  /**
   * A method that fetches a Tree with a given id. Example:
   *
   * @example
   * const Tree = await TreeService.getTreeById(1);
   */
  generateRelations = (relationName: string, depth: number): string[] => {
    const relations = [];
    let currentRelation = relationName;

    for (let i = 0; i < depth; i++) {
      relations.push(currentRelation);
      currentRelation += '.children';
    }

    return relations;
  };

  async getTreeById(treeId: number): Promise<any> {
    const depth = 10;
    const parent = 1;
    const childRelations = this.generateRelations('children', depth);
    const parentRelations = this.generateRelations('parent', parent);
    const relations = [...childRelations, ...parentRelations, 'occupations'];
    const tree = await this.treeRepository.findOne({
      where: { id: treeId },
      relations,
    });
    if (tree) {
      const calculatePositionSum = (node: any): number => {
        if (!node.children || node.children.length === 0) {
          return node.position;
        }
        return (
          node.position +
          node.children.reduce(
            (sum, child) => sum + calculatePositionSum(child),
            0,
          )
        );
      };
      const totalPositionSum = calculatePositionSum(tree);
      return {
        ...tree,
        positionSum: totalPositionSum,
      };
    }
    throw new TreeNotFoundException(treeId);
  }

  /**
   *
   * @param Tree createTree
   *
   */
  async createTree(tree: CreateTreeDto, user: IUser) {
    tree.autorId = user.id;
    // tree.autorName = `${user.lastName} ${user.firstName}`;
    const treeFilter = await this.treeRepository.findOne({
      where: {
        name: tree.name,
        departmentType: tree.departmentType,
        mid: tree.mid,
      },
    });
    console.log('treeFilter', treeFilter);
    if (treeFilter) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `${treeFilter.name} Бүртгэлтэй байна. !!!`,
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const newTree = this.treeRepository.create(tree);
      await this.treeRepository.save(newTree);
      return newTree;
    }
  }

  /**
   * See the [definition of the UpdateTreeDto file]{@link UpdateTreeDto} to see a list of required properties
   */
  async updateTree(
    id: number,
    tree: UpdateTreeDto,
    user: IUser,
  ): Promise<Trees> {
    await this.treeRepository.update(id, tree);
    const updatedTree = await this.treeRepository.findOne({
      where: { id },
    });
    if (updatedTree) {
      return updatedTree;
    }
    throw new TreeNotFoundException(id);
  }

  /**
   * @deprecated Use deleteTree instead
   */
  async deleteTreeById(id: number, user: IUser): Promise<void> {
    return this.deleteTree(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteTree(id: number, user: IUser): Promise<void> {
    const children = await this.treeRepository.find({
      where: { mid: id },
    });

    // const workers = await this.workerRepository.find({
    //   where: { depId: id },
    // });
    // const workersApp = await this.workerRepository.find({
    //   where: { appId: id },
    // });
    if (children.length > 0) {
      throw new HttpException(
        `Tree with ID ${id} has children and cannot be deleted.`,
        HttpStatus.BAD_REQUEST, // 400 алдаа код
      );
    }
    // if (workers.length > 0 || workersApp.length > 0) {
    //   throw new HttpException(
    //     `Тухайн байгууллага/Салбар/Алба, хэлтэст ажилтан бүртгэгдсэн байна`,
    //     HttpStatus.BAD_REQUEST, // 400 алдаа код
    //   );
    // }
    const deleteResponse = await this.treeRepository.softDelete(id);
    if (!deleteResponse.affected) {
      throw new HttpException(
        `Tree with ID ${id} not found.`,
        HttpStatus.NOT_FOUND, // 404 алдаа код
      );
    }
  }
}
