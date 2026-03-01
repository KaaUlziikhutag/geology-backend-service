import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../cloud/user/user.service';
import { ModuleRef } from '@nestjs/core';
import {
  Between,
  EntityManager,
  Equal,
  FindManyOptions,
  ILike,
  In,
} from 'typeorm';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../cloud/user/dto/get-user.dto';
import {
  HumanResourceDto,
  UpdatedWorkerAndUser,
} from './dto/human-resource.dto';
import Human from './member/human/human.entity';
import Worker from './member/worker/worker.entity';
import * as generator from 'generate-password';
import * as bcrypt from 'bcryptjs';
import EmailService from '../shared/email/email.service';
import { GetHumanResourceDto } from './dto/get-human-resource.dto';
import { PageMetaDto } from '../../utils/dto/pageMeta.dto';
import { PageDto } from '../../utils/dto/page.dto';
import WorkerNotFoundException from './member/worker/exceptions/worker-not-found.exception';
import { FieldService } from '../cloud/field/field.service';
import { ProgramService } from '../cloud/programs/program.service';
import Access from './access/access.entity';
import {
  AccessType,
  AppointmentStatusType,
  extractBirthDateFromRegNumber,
  WorkType,
} from '../../utils/globalUtils';
import { ModuleService } from '../cloud/module/modules.service';
import { ColumnService } from './column-setup/column.service';
import Trees from './tree/tree.entity';
import { CountryService } from '../cloud/country/country.service';
import WorkerApp from './member/worker/entities/worker-app.entity';

@Injectable()
export class HumanResourceService {
  constructor(
    private moduleRef: ModuleRef,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly fieldService: FieldService,
    private readonly programService: ProgramService,
    private readonly modulService: ModuleService,
    private readonly countryService: CountryService,
    private columnService: ColumnService,
  ) {}

  private async loadEntityManager(systemId: string): Promise<EntityManager> {
    return this.moduleRef.get(getEntityManagerToken(`ioffice_${systemId}`), {
      strict: false,
    });
  }

  async getAllHumanResource(user: GetUserDto, query: GetHumanResourceDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Worker>['where'] = {};
    const { skip, limit, page } = query;

    if (query.depId || query.groupId || query.appId || query.comId) {
      const findChildrenIds = async (
        parentId: number,
        collectedIds: number[] = [],
      ): Promise<number[]> => {
        const childrens = await entityManager.find(Trees, {
          where: { mid: parentId },
        });
        const childIds = childrens.map((c) => c.id);
        if (childrens.length === 0) {
          collectedIds.push(...[parentId]);
        } else {
          for (const childId of childIds) {
            await findChildrenIds(childId, collectedIds);
          }
        }
        return collectedIds;
      };
      const id = query.depId || query.groupId || query.appId || query.comId;
      const allChildIds = await findChildrenIds(id, []);
      where.appId = In(allChildIds);
    }

    if (query.systemName) {
      where.systemName = ILike('%' + query.systemName + '%');
    }

    if (query.startDate && query.endDate) {
      where.createdAt = Between(query.startDate, query.endDate);
    }
    if (query.ids) {
      const id = [];
      id.push(...query.ids.split(','));
      where.id = In(id);
    }
    if (query.typeOfPosition) {
      const typeOfPositions = query.typeOfPosition
        .split(',')
        .map((type) => type.trim());
      where.appTree = {
        typeOfPosition: In(typeOfPositions),
      };
    }

    if (query.workerType) {
      const workerTypes = query.workerType
        .split(',')
        .map((type) => type.trim());
      where.workerType = In(workerTypes);
    }
    if (query.workerTypeOne) {
      where.workerType = Equal(query.workerTypeOne);
    }
    if (query.accessType == AccessType.Simple) {
      where.id = user.workerId;
    }
    if (query.isActive) {
      where.isActive = query.isActive;
    }
    if (query.employeeType) {
      const employeeTypes = query.employeeType
        .split(',')
        .map((type) => type.trim());
      where.employeeType = In(employeeTypes);
    }

    if (query.filter) {
      where.humans = [
        { regNumber: ILike(`%${query.filter}%`) },
        { lastName: ILike(`%${query.filter}%`) },
        { firstName: ILike(`%${query.filter}%`) },
      ];
    }
    const findOptions: FindManyOptions<Worker> = {
      where,
      order: { createdAt: 'DESC' },
      relations: [
        'humans',
        'children',
        'children.humans',
        'occupations',
        'insurances',
        'appTree',
        'depTree',
      ],
    };
    if (limit !== null && limit !== undefined) {
      findOptions.skip = skip;
      findOptions.take = limit;
    } else {
      findOptions.skip = undefined;
      findOptions.take = undefined;
    }
    const [items, count] = await entityManager.findAndCount(
      Worker,
      findOptions,
    );

    const itemCount = count;
    const pageMetaDto = new PageMetaDto({
      page,
      limit: limit || count,
      itemCount,
    });

    // const columns = [];
    // const fields = await this.fieldService.getFieldByIds(
    //   user.workerId,
    //   'HumanResource',
    //   'TotalStaff',
    // );

    // if (fields) {
    //   columns.push(fields);
    // } else {
    //   const workerColumns = await this.columnService.getAllColumns(
    //     Worker,
    //     entityManager,
    //   );
    //   if (workerColumns.length > 0) {
    //     for (const column of workerColumns) {
    //       const translatedName = await this.columnService.translate(column);
    //       const isExam = await this.columnService.isExamField(column);
    //       const newField = await this.fieldService.createField({
    //         field: column,
    //         workerId: user.workerId,
    //         program: 'HumanResource',
    //         module: 'TotalStaff',
    //         name: column,
    //         title: translatedName,
    //         isShow: isExam,
    //         type: 'Worker',
    //         pos: 0,
    //       });
    //       columns.push(newField);
    //     }
    //   }
    //   const humanColumns = await this.columnService.getAllColumns(
    //     Human,
    //     entityManager,
    //   );
    //   if (humanColumns.length > 0) {
    //     let pos = 0;
    //     for (const column of humanColumns) {
    //       const translatedName = await this.columnService.translate(column);
    //       const isExam = await this.columnService.isExamField(column);
    //       const newField = await this.fieldService.createField({
    //         field: column,
    //         workerId: user.workerId,
    //         program: 'HumanResource',
    //         module: 'TotalStaff',
    //         name: column,
    //         title: translatedName,
    //         isShow: isExam,
    //         type: 'Human',
    //         pos: ++pos,
    //       });
    //       columns.push(newField);
    //     }
    //   }
    // }

    return {
      items: new PageDto(items, pageMetaDto),
      // columns,
    };
  }

  async getAllHistoryDepartment(user: GetUserDto, query: GetHumanResourceDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<WorkerApp>['where'] = {};
    if (query.workerId) {
      where.userId = Equal(query.workerId);
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
    const [items, count] = await entityManager.findAndCount(WorkerApp, {
      where,
      order: {
        createdAt: 'DESC',
      },
      relations: [
        'depTree',
        'appTree',
        'appConfirmWorker',
        'appConfirmWorker.humans',
      ],
      skip: skip,
      take: query.limit,
    });

    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  async getHumanResourceById(
    workerId: number,
    user: GetUserDto,
  ): Promise<Worker> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const worker = await entityManager.findOne(Worker, {
      where: { id: workerId },
      relations: [
        'humans',
        'children',
        'children.humans',
        'occupations',
        'insurances',
        'appTree',
        'depTree',
      ],
    });

    if (worker) {
      const country = await this.countryService.getCountryById(
        worker.humans.region,
      );
      return {
        ...worker,
        countryName: country?.name || 'Unknown',
      } as Worker & { countryName: string };
    }
    throw new WorkerNotFoundException(workerId);
  }

  async getAllHumanResourceCheck(user: GetUserDto, query: GetHumanResourceDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const register = await entityManager.findOne(Human, {
      where: { regNumber: query.regNumber },
    });
    const taxpayerNumber = await entityManager.findOne(Human, {
      where: { taxpayerNumber: query.taxpayerNumber },
    });
    const checkUser = await this.userService.getByEmailCheck(query.workMail);
    const workerCode = await entityManager.findOne(Worker, {
      where: { code: query.code },
    });
    if (query.regNumber) {
      if (register) {
        throw new HttpException(
          'Тухайн хэрэглэгчийн регистер бүртгэлтэй байна.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (query.taxpayerNumber) {
      if (taxpayerNumber) {
        throw new HttpException(
          'Тухайн хэрэглэгчийн ТТД бүртгэлтэй байна.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    if (query.code) {
      if (workerCode) {
        throw new HttpException(
          'Тухайн хэрэглэгчийн код бүртгэлтэй байна.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    if (query.workMail) {
      if (checkUser) {
        throw new HttpException(
          'Тухайн хэрэглэгчийн ажилын майл бүртгэлтэй байна.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async createHumanResource(user: GetUserDto, humanResource: HumanResourceDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    try {
      const checkUser = await this.userService.getByEmailCheck(
        humanResource.workMail,
      );
      const checkRegNumber = await entityManager.findOne(Human, {
        where: { regNumber: humanResource.regNumber },
      });
      const workerCode = await entityManager.findOne(Worker, {
        where: { code: humanResource.code },
      });
      if (workerCode) {
        throw new HttpException(
          'Тухайн хэрэглэгчийн код бүртгэлтэй байна.',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (checkRegNumber) {
        throw new HttpException(
          'Тухайн хэрэглэгчийн регистер бүртгэлтэй байна.',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!checkUser) {
        const newHuman = await entityManager.create(Human, {
          regNumber: humanResource.regNumber,
          familyName: humanResource.familyName,
          firstName: humanResource.firstName,
          lastName: humanResource.lastName,
          nation: humanResource.nation,
          faceBook: humanResource.faceBook,
          birthCityId: humanResource.birthCityId,
          birthCountryId: humanResource.birthCountryId,
          birthDistrictId: humanResource.birthDistrictId,
          birthCommetteeId: humanResource.birthCommetteeId,
          birthDetailAddress: humanResource.birthDetailAddress,
          mcountryId: humanResource.mcountryId,
          mCityId: humanResource.mCityId,
          mDistrictId: humanResource.mDistrictId,
          mCommetteeId: humanResource.mCommetteeId,
          mCommitteeDetailAddress: humanResource.mCommitteeDetailAddress,
          ncountryId: humanResource.ncountryId,
          nCityId: humanResource.nCityId,
          nDistrictId: humanResource.nDistrictId,
          nCommetteeId: humanResource.nCommetteeId,
          nCommitteeDetailAddress: humanResource.nCommitteeDetailAddress,
          taxpayerNumber: humanResource.taxpayerNumber,
          birthDate: extractBirthDateFromRegNumber(humanResource.regNumber),
          disabled: humanResource.disabled,
          region: humanResource.region,
          contacts: humanResource.contacts,
          married: humanResource.married,
          gender: humanResource.gender,
          driveNumber: humanResource.driveNumber,
          personalMail: humanResource.personalMail,
          homePhone: humanResource.homePhone,
          mobile: humanResource.mobile,
          mobileOther: humanResource.mobileOther,
        }); // human add
        await entityManager.save(Human, newHuman);

        const structure = await entityManager.findOne(Trees, {
          where: { id: humanResource.appId },
        });
        const depStructure = await entityManager.findOne(Trees, {
          where: { id: structure?.mid },
        });
        const newWorker = await entityManager.create(Worker, {
          workMail: humanResource.workMail,
          humanId: newHuman.id,
          profileId: humanResource.profileId,
          occupationId: humanResource.occupationId,
          insuranceId: humanResource.insuranceId,
          isActive: 1,
          dateOfEmployment: humanResource.dateOfEmployment,
          appId: humanResource.appId,
          depId: depStructure?.id,
          systemName: humanResource.systemName,
          workPhone: humanResource.workPhone,
          temporaryOptions: humanResource.temporaryOptions,
          workerType: WorkType.Active,
          code: humanResource.code,
          jobAction: humanResource.jobAction,
          employeeType: humanResource.employeeType,
          companyId: user.companyId,
        }); // worker add
        await entityManager.save(Worker, newWorker);
        if (humanResource.appId) {
          const departmentHistory = await entityManager.create(WorkerApp, {
            userId: newWorker.id,
            companyId: user.companyId,
            depId: humanResource.depId,
            appId: depStructure.id,
            jobAction: humanResource.jobAction,
            workerType: AppointmentStatusType.Expected,
            date: new Date(),
          });
          await entityManager.save(WorkerApp, departmentHistory);
        }
        const password = generator.generate({
          length: 6,
          numbers: true,
        });
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.userService.createUser({
          workerId: newWorker.id,
          companyId: user.companyId,
          email: humanResource.workMail,
          phoneNo: humanResource.mobile,
          dataBase: user.dataBase,
          password: hashedPassword,
          firstName: humanResource.firstName,
          lastName: humanResource.lastName,
          profileId: humanResource.profileId,
        }); // user add
        await this.emailService.sendUserEmailPassword(newWorker.workMail, {
          email: newWorker.workMail,
          password: password,
        });
        const programs = await this.programService.getAllProgram();
        const moules = await this.modulService.getAllMoule();
        await Promise.all(
          programs.map(async (program) => {
            const newAccess = entityManager.create(Access, {
              workerId: newWorker.id,
              proId: program.id,
              modId: 0,
              access: AccessType.Simple,
              comId: user.companyId,
            });
            await entityManager.save(Access, newAccess);
          }),
        );
        await Promise.all(
          moules.map(async (module) => {
            const newAccess = await entityManager.create(Access, {
              workerId: newWorker.id,
              proId: module.proId,
              modId: module.id,
              access: AccessType.Simple,
              comId: user.companyId,
            });
            await entityManager.save(Access, newAccess);
          }),
        );
      } else
        throw new HttpException(
          'Тухайн хэрэглэгчийн ажлын имэйл хаяг бүртгэлтэй байна.',
          HttpStatus.BAD_REQUEST,
        );
    } catch (error) {
      const err = error as Error;
      throw new HttpException(
        {
          message: err.message,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          options: {
            cause: error,
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateHumanResource(
    id: number,
    user: GetUserDto,
    humanResource: HumanResourceDto,
  ): Promise<Worker> {
    const entityManager = await this.loadEntityManager(user.dataBase);

    try {
      const existingWorker = await entityManager.findOne(Worker, {
        where: { id: id },
      });

      if (!existingWorker) {
        throw new WorkerNotFoundException(id);
      }
      const existingHuman = await entityManager.findOne(Human, {
        where: { id: existingWorker.humanId },
      });
      if (
        humanResource.workMail &&
        humanResource.workMail !== existingWorker.workMail
      ) {
        const password = generator.generate({
          length: 6,
          numbers: true,
          excludeSimilarCharacters: true,
        });
        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = await this.userService.getUserByWorkerId(
          existingWorker.id,
        );
        await this.userService.updateUser(userData.id, {
          email: humanResource.workMail,
          password: hashedPassword,
        });
        await this.emailService.sendUserEmailPassword(humanResource.workMail, {
          email: humanResource.workMail,
          password: password,
        });
      }

      if (!existingHuman) {
        throw new HttpException('Human not found', HttpStatus.NOT_FOUND);
      }
      const birthDate = humanResource.regNumber
        ? extractBirthDateFromRegNumber(humanResource.regNumber)
        : existingHuman.birthDate;
      entityManager.merge(Human, existingHuman, {
        regNumber: humanResource.regNumber,
        familyName: humanResource.familyName,
        firstName: humanResource.firstName,
        lastName: humanResource.lastName,
        faceBook: humanResource.faceBook,
        nation: humanResource.nation,
        birthCityId: humanResource.birthCityId,
        birthCountryId: humanResource.birthCountryId,
        birthDistrictId: humanResource.birthDistrictId,
        birthCommetteeId: humanResource.birthCommetteeId,
        birthDetailAddress: humanResource.birthDetailAddress,
        mcountryId: humanResource.mcountryId,
        mCityId: humanResource.mCityId,
        mDistrictId: humanResource.mDistrictId,
        mCommetteeId: humanResource.mCommetteeId,
        mCommitteeDetailAddress: humanResource.mCommitteeDetailAddress,
        ncountryId: humanResource.ncountryId,
        nCityId: humanResource.nCityId,
        nDistrictId: humanResource.nDistrictId,
        nCommetteeId: humanResource.nCommetteeId,
        nCommitteeDetailAddress: humanResource.nCommitteeDetailAddress,
        taxpayerNumber: humanResource.taxpayerNumber,
        birthDate: birthDate,
        disabled: humanResource.disabled,
        region: humanResource.region,
        married: humanResource.married,
        gender: humanResource.gender,
        driveNumber: humanResource.driveNumber,
        personalMail: humanResource.personalMail,
        homePhone: humanResource.homePhone,
        mobile: humanResource.mobile,
        mobileOther: humanResource.mobileOther,
      });
      await entityManager.save(Human, existingHuman);

      // Update Worker entity fields
      const structure = await entityManager.findOne(Trees, {
        where: { id: humanResource.appId },
      });
      const depStructure = await entityManager.findOne(Trees, {
        where: { id: structure.mid },
      });
      entityManager.merge(Worker, existingWorker, {
        workMail: humanResource.workMail,
        profileId: humanResource.profileId,
        systemName: humanResource.systemName,
        workerType: humanResource.workerType,
        isActive: humanResource.isActive,
        appId: humanResource.appId,
        depId: depStructure.id,
        appName: structure.name,
        dateOfEmployment: humanResource.dateOfEmployment,
        depName: depStructure.name,
        jobAction: humanResource.jobAction,
        occupationId: humanResource.occupationId,
        insuranceId: humanResource.insuranceId,
        code: humanResource.code,
        workPhone: humanResource.workPhone,
        temporaryOptions: humanResource.temporaryOptions,
        employeeType: humanResource.employeeType,
        companyId: user.companyId,
      });
      await entityManager.save(Worker, existingWorker);
      return existingWorker;
    } catch (error) {
      const err = error as Error;
      throw new HttpException(
        {
          message: err.message || 'Internal Server Error',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          options: { cause: error },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  //Ажилтны Төлөв солих
  async updateTypeHumanResource(
    ids: number[],
    user: GetUserDto,
    humanResource: HumanResourceDto,
  ): Promise<Worker[]> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    try {
      const updatedWorkers: Worker[] = [];
      for (const id of ids) {
        const existingWorker = await entityManager.findOne(Worker, {
          where: { id: id },
        });
        if (!existingWorker) {
          throw new WorkerNotFoundException(id);
        }
        entityManager.merge(Worker, existingWorker, {
          workerType: humanResource.workerType,
        });
        const updatedWorker = await entityManager.save(Worker, existingWorker);
        updatedWorkers.push(updatedWorker);
      }
      return updatedWorkers;
    } catch (error) {
      const err = error as Error;
      throw new HttpException(
        {
          message: err.message || 'Internal Server Error',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          options: { cause: error },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Систем төлөв солих
  async updateSystemHumanResource(
    ids: number[],
    user: GetUserDto,
    humanResource: HumanResourceDto,
  ): Promise<UpdatedWorkerAndUser[]> {
    const entityManager = await this.loadEntityManager(user.dataBase);

    try {
      const updatedWorkers: UpdatedWorkerAndUser[] = [];
      for (const id of ids) {
        const existingWorker = await entityManager.findOne(Worker, {
          where: { id: id },
        });

        if (!existingWorker) {
          throw new WorkerNotFoundException(id);
        }
        const users = await this.userService.getUserByWorkerId(id);
        if (!users) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        entityManager.merge(Worker, existingWorker, {
          isActive: humanResource.isActive,
        });
        const updatedWorker = await entityManager.save(Worker, existingWorker);
        const updatedUser = await this.userService.updateUser(users.id, {
          isActive: humanResource.isActive,
        });

        // Push a custom object containing both the worker and the user updates
        updatedWorkers.push({
          worker: updatedWorker,
          user: updatedUser,
        });
      }
      return updatedWorkers;
    } catch (error) {
      const err = error as Error;
      throw new HttpException(
        {
          message: err.message || 'Internal Server Error',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          options: { cause: error },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //Албан тушаалд томилох
  async updateStructureHumanResource(
    ids: number[],
    user: GetUserDto,
    humanResource: HumanResourceDto,
  ): Promise<Worker[]> {
    const entityManager = await this.loadEntityManager(user.dataBase);

    try {
      const updatedWorkers: Worker[] = [];
      for (const id of ids) {
        const existingWorker = await entityManager.findOne(Worker, {
          where: { id: id },
        });

        if (!existingWorker) {
          throw new WorkerNotFoundException(id);
        }
        console.log('humanResource', humanResource);
        const departmentHistory = await entityManager.create(WorkerApp, {
          userId: id,
          companyId: user.companyId,
          depId: humanResource.depId,
          appId: humanResource.appId,
          jobAction: humanResource.jobAction,
          workerType: AppointmentStatusType.Expected,
          confirmId: humanResource.holderId,
          date: new Date(),
        });
        console.log('departmentHistory', departmentHistory);
        await entityManager.save(WorkerApp, departmentHistory);
        entityManager.merge(Worker, existingWorker, {
          depId: humanResource.depId,
          appId: humanResource.appId,
          depName: humanResource.depName,
          dateOfEmployment: humanResource.dateOfEmployment,
          appName: humanResource.appName,
          confirmId: humanResource.confirmId,
          workerType: 0,
          jobAction: humanResource.jobAction,
        });
        const updatedWorker = await entityManager.save(Worker, existingWorker);
        updatedWorkers.push(updatedWorker);
      }
      return updatedWorkers;
    } catch (error) {
      const err = error as Error;
      throw new HttpException(
        {
          message: err.message || 'Internal Server Error',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          options: { cause: error },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteWorkerById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteHumanResource(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteHumanResource(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);

    try {
      await entityManager.transaction(async (transactionalEntityManager) => {
        const worker = await transactionalEntityManager.findOne(Worker, {
          where: { id, companyId: user.companyId },
        });

        if (!worker) {
          throw new HttpException('Worker not found.', HttpStatus.NOT_FOUND);
        }

        const human = await transactionalEntityManager.findOne(Human, {
          where: { id: worker.humanId },
        });

        if (!human) {
          throw new HttpException('Human not found.', HttpStatus.NOT_FOUND);
        }

        await transactionalEntityManager.softDelete(Worker, worker.id);

        await transactionalEntityManager.softDelete(Human, human.id);
        await transactionalEntityManager.softDelete(Access, {
          workerId: worker.id,
        });
      });
    } catch (error) {
      const err = error as Error;
      throw new HttpException(
        {
          message: err.message,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          options: {
            cause: error,
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
