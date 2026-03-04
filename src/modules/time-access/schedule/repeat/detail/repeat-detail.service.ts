import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRepeatDetailDto } from './dto/create-repeat-detail.dto';
import { UpdateRepeatDetailDto } from './dto/update-repeat-detail.dto';
import { GetRepeatDetailDto } from './dto/get-repeat-detail.dto';
import {
  EntityManager,
  Equal,
  FindManyOptions,
  In,
  MoreThan,
  Repository,
} from 'typeorm';
import RepeatDetails from './entities/repeat-detail.entity';
import RepeatDetailNotFoundException from './exceptions/repeat-detail-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken, InjectRepository } from '@nestjs/typeorm';
import Trees from '../../../../human-resource/tree/tree.entity';
import RepeatDetailViewUser from './entities/repeat-user.entity';
import RepeatSchedules from '../schedule/schedule.entity';
import Worker from '../../../../human-resource/member/worker/worker.entity';
import IUser from '@modules/users/interface/user.interface';
@Injectable()
export class RepeatDetailService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(RepeatDetails)
    private readonly repeatDetailRepository: Repository<RepeatDetails>,
    private moduleRef: ModuleRef,
  ) {}

  private async loadEntityManager(systemId: string): Promise<EntityManager> {
    return this.moduleRef.get(getEntityManagerToken(`ioffice_${systemId}`), {
      strict: false,
    });
  }

  /**
   * A method that fetches the RepeatDetail from the database
   * @returns A promise with the list of RepeatDetails
   */
  async getAllRepeatDetail(query: GetRepeatDetailDto) {
    const where: FindManyOptions<RepeatDetails>['where'] = {};
    if (query.repeatId) {
      where.repeatId = Equal(query.repeatId);
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
    const [items, count] = await this.repeatDetailRepository.findAndCount({
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
   * A method that fetches a RepeatDetail with a given id. Example:
   *
   * @example
   * const RepeatDetail = await RepeatDetailService.getRepeatDetailById(1);
   */
  async getRepeatDetailById(
    repeatDetailId: number,
    user: IUser,
  ): Promise<RepeatDetails> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const repeatDetail = await entityManager.findOne(RepeatDetails, {
      where: { id: repeatDetailId },
    });
    if (repeatDetail) {
      return repeatDetail;
    }
    throw new RepeatDetailNotFoundException(repeatDetailId);
  }

  /**
   *
   * @param RepeatDetail createRepeatDetail
   *
   */
  async createRepeatDetail(repeatDetail: CreateRepeatDetailDto) {
    console.log('repeatDetail', repeatDetail);
    if (repeatDetail.treeIds && repeatDetail.treeIds.length > 0) {
      // const trees = await entityManager.find(Trees, {
      //   where: { id: In(repeatDetail.treeIds) },
      // });
      // if (!trees || trees.length !== repeatDetail.treeIds.length) {
      //   throw new Error('Some of the treeIds are invalid');
      // }
      // repeatDetail.trees = trees;
    }
    let workerIds: number[] = [];
    if (repeatDetail.treeIds && repeatDetail.treeIds.length > 0) {
      // const workers = await entityManager.find(Worker, {
      //   where: [
      //     { depId: In(repeatDetail.treeIds) },
      //     { appId: In(repeatDetail.treeIds) },
      //   ],
      // });
      // workerIds = workers.map((w) => w.id);
    }
    const allUserIds = new Set<number>();
    (repeatDetail.viewUserIds || []).forEach((id) => allUserIds.add(id));
    workerIds.forEach((id) => allUserIds.add(id));
    const nowUtc = new Date(new Date().toISOString());
    const conflictingUserIds: number[] = [];
    for (const id of allUserIds) {
      // const schedule = await entityManager.findOne(RepeatSchedules, {
      //   where: {
      //     userId: id,
      //     startDate: MoreThan(nowUtc),
      //   },
      // });
      // if (schedule) {
      //   conflictingUserIds.push(id);
      // }
    }
    if (conflictingUserIds.length > 0) {
      // const conflictingUsers = await entityManager.find(Worker, {
      //   where: { id: In(conflictingUserIds) },
      //   relations: ['humans'],
      // });
      throw new ConflictException({
        message: 'Some users already have a schedule.',
        // users: conflictingUsers.map((worker) => ({
        //   id: worker.id,
        //   firstName: worker.humans?.firstName || null,
        //   lastName: worker.humans?.lastName || null,
        // })),
      });
    }
    const newRepeatDetail = this.repeatDetailRepository.create(repeatDetail);
    await this.repeatDetailRepository.save(newRepeatDetail);
    // if (allUserIds.size > 0) {
    //   const repeatViewUsers = Array.from(allUserIds).map((id) =>
    //     entityManager.create(RepeatDetailViewUser, {
    //       repeatDetailId: (newRepeatDetail as RepeatDetails).id,
    //       userId: id,
    //     }),
    //   );
    //   await entityManager.save(RepeatDetailViewUser, repeatViewUsers);
    // }
    return newRepeatDetail;
  }

  /**
   * See the [definition of the UpdateRepeatDetailDto file]{@link UpdateRepeatDetailDto} to see a list of required properties
   */
  async updateRepeatDetail(
    id: number,
    user: IUser,
    repeatDetail: UpdateRepeatDetailDto,
  ): Promise<RepeatDetails> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const existing = await entityManager.findOne(RepeatDetails, {
      where: { id },
      relations: ['trees', 'viewUsers'],
    });

    if (!existing) {
      throw new RepeatDetailNotFoundException(id);
    }
    if (repeatDetail.treeIds) {
      const trees = await entityManager.find(Trees, {
        where: { id: In(repeatDetail.treeIds) },
      });
      if (trees.length !== repeatDetail.treeIds.length) {
        throw new Error('Some of the treeIds are invalid');
      }
      existing.trees = trees;
    }
    entityManager.merge(RepeatDetails, existing, repeatDetail);
    await entityManager.save(existing);
    if (repeatDetail.viewUserIds) {
      await entityManager.delete(RepeatDetailViewUser, {
        repeatDetailId: id,
      });
      if (repeatDetail.viewUserIds.length > 0) {
        const viewUsers = repeatDetail.viewUserIds.map((userId) =>
          entityManager.create(RepeatDetailViewUser, {
            repeatDetailId: id,
            userId,
          }),
        );
        await entityManager.save(RepeatDetailViewUser, viewUsers);
      }
    }
    return existing;
  }

  async updateMultipleRepeatDetails(
    repeatDetails: UpdateRepeatDetailDto[],
  ): Promise<RepeatDetails[]> {
    const results: RepeatDetails[] = [];
    await this.repeatDetailRepository.manager.transaction(
      async (transactionalEntityManager) => {
        for (const detail of repeatDetails) {
          try {
            if (detail.id === undefined) {
              const created = await this.createRepeatDetail(
                detail as CreateRepeatDetailDto,
              );
              results.push(created as RepeatDetails);
              continue;
            }
            const existing = await transactionalEntityManager.findOne(
              RepeatDetails,
              {
                where: { id: detail.id },
                relations: ['trees', 'viewUsers'],
              },
            );
            if (!existing) {
              throw new RepeatDetailNotFoundException(detail.id);
            }
            let workerIds: number[] = [];
            if (detail.treeIds?.length) {
              const trees = await transactionalEntityManager.find(Trees, {
                where: { id: In(detail.treeIds) },
              });
              if (trees.length !== detail.treeIds.length) {
                const foundIds = trees.map((t) => t.id);
                const missingIds = detail.treeIds.filter(
                  (id) => !foundIds.includes(id),
                );
                throw new Error(`Invalid treeIds: ${missingIds.join(', ')}`);
              }
              existing.trees = trees;
              workerIds = await this.getWorkerIdsForTrees(
                transactionalEntityManager,
                detail.treeIds,
              );
            }
            const allUserIds = this.combineUserIds(
              detail.viewUserIds,
              workerIds,
            );
            if (allUserIds.size > 0) {
              await this.validateNoScheduleConflicts(
                transactionalEntityManager,
                Array.from(allUserIds),
                existing.id,
              );
            }
            this.updateRepeatDetailFields(existing, detail);
            await transactionalEntityManager.save(existing);
            await this.updateViewUsers(
              transactionalEntityManager,
              existing.id,
              Array.from(allUserIds),
            );
            results.push(existing);
          } catch (error) {
            if (error instanceof Error && detail.id) {
              error.message = `Error processing repeat detail ${detail.id}: ${error.message}`;
            }
            throw error;
          }
        }
      },
    );
    return results;
  }

  private async getWorkerIdsForTrees(
    entityManager: EntityManager,
    treeIds: number[],
  ): Promise<number[]> {
    const workers = await entityManager.find(Worker, {
      where: [{ depId: In(treeIds) }, { appId: In(treeIds) }],
      select: ['id'],
    });
    return workers.map((w) => w.id);
  }

  private combineUserIds(
    viewUserIds: number[] | undefined,
    workerIds: number[],
  ): Set<number> {
    const allUserIds = new Set<number>();
    (viewUserIds || []).forEach((id) => allUserIds.add(id));
    workerIds.forEach((id) => allUserIds.add(id));
    return allUserIds;
  }

  private async validateNoScheduleConflicts(
    entityManager: EntityManager,
    userIds: number[],
    detailId: number,
  ): Promise<void> {
    const nowUtc = new Date(new Date().toISOString());
    const conflicts = await entityManager.find(RepeatSchedules, {
      where: {
        userId: In(userIds),
        startDate: MoreThan(nowUtc),
      },
      relations: ['worker', 'worker.humans'],
    });
    if (conflicts.length > 0) {
      const conflictingUsers = conflicts.map((schedule) => ({
        id: schedule.userId,
        firstName: schedule.worker?.humans?.firstName || null,
        lastName: schedule.worker?.humans?.lastName || null,
      }));
      throw new ConflictException({
        message: `Some users already have a schedule for RepeatDetail ID ${detailId}`,
        users: conflictingUsers,
      });
    }
  }

  private updateRepeatDetailFields(
    existing: RepeatDetails,
    update: UpdateRepeatDetailDto,
  ): void {
    const fieldsToUpdate: (keyof UpdateRepeatDetailDto)[] = [
      'name',
      'graphicId',
      'repeatId',
      'position',
      'startPosition',
    ];
    fieldsToUpdate.forEach((field) => {
      if (update[field] !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (existing as any)[field] = update[field]!;
      }
    });
  }
  private async updateViewUsers(
    entityManager: EntityManager,
    repeatDetailId: number,
    userIds: number[],
  ): Promise<void> {
    await entityManager.delete(RepeatDetailViewUser, { repeatDetailId });
    if (userIds.length > 0) {
      const repeatViewUsers = userIds.map((userId) =>
        entityManager.create(RepeatDetailViewUser, {
          repeatDetailId,
          userId,
        }),
      );
      await entityManager.save(RepeatDetailViewUser, repeatViewUsers);
    }
  }

  /**
   * @deprecated Use deleteRepeatDetail instead
   */
  async deleteRepeatDetailById(id: number, user: IUser): Promise<void> {
    return this.deleteRepeatDetail(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteRepeatDetail(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteRepeatDetail = await entityManager.findOne(RepeatDetails, {
      where: { id },
    });
    const today = new Date();
    const repeatSchedules = await entityManager.find(RepeatSchedules, {
      where: {
        graphicId: deleteRepeatDetail.graphicId,
        startDate: MoreThan(today),
      },
    });
    for (const schedule of repeatSchedules) {
      console.log('schedule', schedule);
      await entityManager.softRemove(schedule);
    }
    const deleteResponse = await entityManager.softDelete(RepeatDetails, id);
    if (!deleteResponse.affected) {
      throw new RepeatDetailNotFoundException(id);
    }
  }
}
