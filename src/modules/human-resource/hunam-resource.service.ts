import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  Between,
  EntityManager,
  Equal,
  FindManyOptions,
  ILike,
  In,
  Repository,
} from 'typeorm';
import { getEntityManagerToken, InjectRepository } from '@nestjs/typeorm';
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
import PageMetaDto from '../../utils/dto/page-meta.dto';
import PageDto from '../../utils/dto/page.dto';
import WorkerNotFoundException from './member/worker/exceptions/worker-not-found.exception';
import { FieldService } from '../cloud/field/field.service';
import { ProgramService } from '../cloud/programs/program.service';
import Access from './access/access.entity';
import { AccessType, AppointmentStatusType, WorkType } from '@utils/enum-utils';
import { ModuleService } from '../cloud/module/modules.service';
import { ColumnService } from './column-setup/column.service';
import Trees from './tree/tree.entity';
import { CountryService } from '../cloud/country/country.service';
import WorkerApp from './member/worker/entities/worker-app.entity';
import IUser from '@modules/users/interface/user.interface';
import { extractBirthDateFromRegNumber } from '@utils/helper-utils';
import { UsersService } from '@modules/users/users.service';
import { TreeService } from './tree/tree.service';

@Injectable()
export class HumanResourceService {
  constructor(
    @InjectRepository(Human)
    private readonly humanRepository: Repository<Human>,
    @InjectRepository(Worker)
    private readonly workerRepository: Repository<Worker>,
    private readonly treeService: TreeService,
    private moduleRef: ModuleRef,
    private readonly userService: UsersService,
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

  async getAllHumanResource(user: IUser, query: GetHumanResourceDto) {
    const where: FindManyOptions<Worker>['where'] = {};
    const { skip, limit, page } = query;

    if (query.depId || query.groupId || query.appId || query.comId) {
      // const findChildrenIds = async (
      //   parentId: number,
      //   collectedIds: number[] = [],
      // ): Promise<number[]> => {
      //   const childrens = await entityManager.find(Trees, {
      //     where: { mid: parentId },
      //   });
      //   const childIds = childrens.map((c) => c.id);
      //   if (childrens.length === 0) {
      //     collectedIds.push(...[parentId]);
      //   } else {
      //     for (const childId of childIds) {
      //       await findChildrenIds(childId, collectedIds);
      //     }
      //   }
      //   return collectedIds;
      // };
      // const id = query.depId || query.groupId || query.appId || query.comId;
      // const allChildIds = await findChildrenIds(id, []);
      // where.appId = In(allChildIds);
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
      where.id = user.id;
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
    const [items, itemCount] = await this.workerRepository.findAndCount({
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
    });
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });

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

  async getAllHistoryDepartment(user: IUser, query: GetHumanResourceDto) {
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

  async getHumanResourceById(workerId: number, user: IUser): Promise<Worker> {
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

  async getAllHumanResourceCheck(query: GetHumanResourceDto) {
    const register = await this.humanRepository.findOne({
      where: { regNumber: query.regNumber },
    });
    const taxpayerNumber = await this.humanRepository.findOne({
      where: { taxpayerNumber: query.taxpayerNumber },
    });
    // const checkUser = await this.userService.getByEmail(query.workMail);
    // const workerCode = await entityManager.findOne(Worker, {
    //   where: { code: query.code },
    // });
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
      // if (workerCode) {
      //   throw new HttpException(
      //     'Тухайн хэрэглэгчийн код бүртгэлтэй байна.',
      //     HttpStatus.BAD_REQUEST,
      //   );
      // }
    }
    // if (query.workMail) {
    //   if (checkUser) {
    //     throw new HttpException(
    //       'Тухайн хэрэглэгчийн ажилын майл бүртгэлтэй байна.',
    //       HttpStatus.BAD_REQUEST,
    //     );
    //   }
    // }
  }

  async createHumanResource(humanResource: HumanResourceDto) {
    try {
      // const checkUser = await this.userService.getByEmail(
      //   humanResource.workMail,
      // );
      const checkRegNumber = await this.humanRepository.findOne({
        where: { regNumber: humanResource.regNumber },
      });
      const workerCode = await this.workerRepository.findOne({
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
      const newHuman = this.humanRepository.create({
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
      await this.humanRepository.save(newHuman);

      const structure = await this.treeService.getTreeById(humanResource.appId);
      const depStructure = await this.treeService.getTreeById(structure?.mid);
      const newWorker = this.workerRepository.create({
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
        companyId: null,
      }); // worker add
      await this.workerRepository.save(newWorker);
      if (humanResource.appId) {
        // const departmentHistory = entityManager.create(WorkerApp, {
        //   userId: newWorker.id,
        //   companyId: null,
        //   depId: humanResource.depId,
        //   appId: depStructure.id,
        //   jobAction: humanResource.jobAction,
        //   workerType: AppointmentStatusType.Expected,
        //   date: new Date(),
        // });
        // await entityManager.save(WorkerApp, departmentHistory);
      }
      const password = generator.generate({
        length: 6,
        numbers: true,
      });
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.userService.create({
        // workerId: newWorker.id,
        // companyId: null,
        email: humanResource.workMail,
        // phoneNo: humanResource.mobile,
        // dataBase: user.dataBase,
        password: hashedPassword,
        firstName: humanResource.firstName,
        lastName: humanResource.lastName,
        username: humanResource.mobile,
        phone: humanResource.mobile,
        address: '',
        avatarId: 0,
        isActive: true,
      }); // user add
      await this.emailService.sendUserEmailPassword(newWorker.workMail, {
        email: newWorker.workMail,
        password: password,
      });
      const programs = await this.programService.getAllProgram();
      const moules = await this.modulService.getAllMoule();
      await Promise.all(
        programs.map(async (program) => {
          // const newAccess = entityManager.create(Access, {
          //   workerId: newWorker.id,
          //   proId: program.id,
          //   modId: 0,
          //   access: AccessType.Simple,
          //   comId: null,
          // });
          // await entityManager.save(Access, newAccess);
        }),
      );
      await Promise.all(
        moules.map(async (module) => {
          // const newAccess = await entityManager.create(Access, {
          //   workerId: newWorker.id,
          //   proId: module.proId,
          //   modId: module.id,
          //   access: AccessType.Simple,
          //   companyId: null,
          // });
          // await entityManager.save(Access, newAccess);
        }),
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
    user: IUser,
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
        const userData = await this.userService.getById(existingWorker.id);
        await this.userService.updateUser(userData.id, {
          email: humanResource.workMail,
          password: hashedPassword,
          id: 0,
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
        companyId: null,
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
    user: IUser,
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
    user: IUser,
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
        const users = await this.userService.getById(id);
        if (!users) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        entityManager.merge(Worker, existingWorker, {
          isActive: humanResource.isActive,
        });
        const updatedWorker = await entityManager.save(Worker, existingWorker);
        const updatedUser = await this.userService.updateUser(users.id, {
          isActive: Boolean(humanResource.isActive),
          id: 0,
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
    user: IUser,
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
          companyId: null,
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

  async deleteWorkerById(id: number, user: IUser): Promise<void> {
    return this.deleteHumanResource(id, user);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteHumanResource(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);

    try {
      await entityManager.transaction(async (transactionalEntityManager) => {
        const worker = await transactionalEntityManager.findOne(Worker, {
          where: { id, companyId: null },
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
