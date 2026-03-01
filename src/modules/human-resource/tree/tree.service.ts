import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTreeDto } from './dto/create-tree.dto';
import { UpdateTreeDto } from './dto/update-tree.dto';
import { GetTreeDto } from './dto/get-tree.dto';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager, Equal, FindManyOptions, ILike } from 'typeorm';
import Trees from './tree.entity';
import TreeNotFoundException from './exceptions/tree-not-found.exception';
import { PageDto } from '../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import GetUserDto from '../../cloud/user/dto/get-user.dto';
import Worker from '../member/worker/worker.entity';

@Injectable()
export class TreeService {
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
   * A method that fetches the companies from the database
   * @returns A promise with the list of Trees
   */
  async getAllTrees(query: GetTreeDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Trees>['where'] = {};
    if (query.name) {
      where.name = ILike('%' + query.name + '%');
    }

    if (query.type) {
      where.type = Equal(query.type);
    }

    const trees = await entityManager.find(Trees, {
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

  async getTreeById(treeId: number, user: GetUserDto): Promise<any> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const depth = 10;
    const parent = 1;
    const childRelations = this.generateRelations('children', depth);
    const parentRelations = this.generateRelations('parent', parent);
    const relations = [...childRelations, ...parentRelations, 'occupations'];
    const tree = await entityManager.findOne(Trees, {
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
  async createTree(tree: CreateTreeDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    tree.autorId = user.workerId;
    tree.autorName = `${user.lastName} ${user.firstName}`;
    const treeFilter = await entityManager.findOne(Trees, {
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
      const newTree = entityManager.create(Trees, tree);
      await entityManager.save(newTree);
      return newTree;
    }
  }

  /**
   * See the [definition of the UpdateTreeDto file]{@link UpdateTreeDto} to see a list of required properties
   */
  async updateTree(
    id: number,
    tree: UpdateTreeDto,
    user: GetUserDto,
  ): Promise<Trees> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Trees, id, tree);
    const updatedTree = await entityManager.findOne(Trees, {
      where: { id: id },
    });
    if (updatedTree) {
      return updatedTree;
    }
    throw new TreeNotFoundException(id);
  }

  /**
   * @deprecated Use deleteTree instead
   */
  async deleteTreeById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteTree(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteTree(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const children = await entityManager.find(Trees, {
      where: { mid: id },
    });

    const workers = await entityManager.find(Worker, {
      where: { depId: id },
    });
    const workersApp = await entityManager.find(Worker, {
      where: { appId: id },
    });
    if (children.length > 0) {
      throw new HttpException(
        `Tree with ID ${id} has children and cannot be deleted.`,
        HttpStatus.BAD_REQUEST, // 400 алдаа код
      );
    }
    if (workers.length > 0 || workersApp.length > 0) {
      throw new HttpException(
        `Тухайн байгууллага/Салбар/Алба, хэлтэст ажилтан бүртгэгдсэн байна`,
        HttpStatus.BAD_REQUEST, // 400 алдаа код
      );
    }
    const deleteResponse = await entityManager.softDelete(Trees, id);
    if (!deleteResponse.affected) {
      throw new HttpException(
        `Tree with ID ${id} not found.`,
        HttpStatus.NOT_FOUND, // 404 алдаа код
      );
    }
  }
}
