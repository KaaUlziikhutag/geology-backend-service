import { Injectable } from '@nestjs/common';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../cloud/user/dto/get-user.dto';
import {
  findChildrenIds,
  getAgeCounts,
  getAppointmentReport,
  getCloseWorkerCounts,
  getContractTypes,
  getEmployeeTypeCounts,
  getGenderCounts,
  getHolidayReport,
  getMarriedCounts,
  getNewWorkerCounts,
  getTemporaryOptionsCounts,
  getTotalSum,
  getTreePositionCounts,
  getTypeOfPositionCounts,
} from '../../utils/reportUtils';
import { GetDashboardDto } from './dto/get-dashboard.dto';
import Worker from '../human-resource/member/worker/worker.entity';
import Contract from '../contract/contract.entity';

@Injectable()
export class DashboardService {
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
   * A method that fetches the Worker from the database
   * @returns A promise with the list of Workers
   */

  async getAllHumanResourceDashboard(user: GetUserDto, query: GetDashboardDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);

    // Тогтмол утгууд
    const groupedValues = ['1', '5', '6', '7'];
    const workTypeLabels: { [key: string]: string } = {
      '0': 'Идэвхтэй',
      '1': 'Inactive',
      '2': 'MaternityLeave',
      '3': 'HaveLongVacation',
      '4': 'Freely',
      '8': 'Shift',
      '9': 'Appointment',
      grouped: 'Grouped',
    };
    // Ажилчдын төрлөөр нь тоолох query
    const getCountQuery = async (field: string, alias: string) => {
      const queryBuilder = entityManager
        .createQueryBuilder(Worker, 'worker_i')
        .select(`worker_i.${field}`, alias)
        .addSelect('COUNT(worker_i.id)', 'count')
        .innerJoin('worker_i.humans', 'human')
        .innerJoin('worker_i.appTree', 'appTree')
        .innerJoin('worker_i.depTree', 'depTree')
        .where('worker_i.deleted_at IS NULL')
        .groupBy(`worker_i.${field}`);

      if (query.year) {
        const startDate = `${query.year}-01-01 00:00:00`; // Тухайн жилийн эхний өдөр
        const endDate = `${query.year}-12-31 23:59:59`; // Тухайн жилийн сүүлийн өдөр
        queryBuilder.andWhere(
          'worker_i.date_of_employment BETWEEN :startDate AND :endDate',
          {
            startDate,
            endDate,
          },
        );
      }
      if (query.maritalStatus !== undefined) {
        queryBuilder.andWhere('human.married = :maritalStatus', {
          maritalStatus: query.maritalStatus,
        });
      }
      if (query.workerType !== undefined) {
        queryBuilder.andWhere('worker_i.worker_type = :workerType', {
          workerType: query.workerType,
        });
      }
      if (query.treeId) {
        const allChildIds = await findChildrenIds(entityManager, query.treeId);
        queryBuilder.andWhere('appTree.id IN (:...treeId)', {
          treeId: allChildIds,
        });
      }
      if (query.temporaryOptions !== undefined) {
        queryBuilder.andWhere(
          'worker_i.temporary_options = :temporaryOptions',
          {
            temporaryOptions: query.temporaryOptions,
          },
        );
      }
      if (query.typeOfPosition !== undefined) {
        queryBuilder.andWhere('appTree.type_of_position = :typeOfPosition', {
          typeOfPosition: query.typeOfPosition,
        });
      }
      if (query.employeeType !== undefined) {
        queryBuilder.andWhere('worker_i.employee_type = :employeeType', {
          employeeType: query.employeeType,
        });
      }
      if (query.gender !== undefined) {
        queryBuilder.andWhere('human.gender = :gender', {
          gender: query.gender,
        });
      }
      return queryBuilder;
    };
    // Өгөгдлийг авах
    const rawCountsQuery = await getCountQuery('worker_type', 'workType');
    const rawCounts = await rawCountsQuery.getRawMany();

    // Группчлагдсан тоололт
    let groupedCount = 0;
    const groupedCounts = rawCounts.reduce((acc, item) => {
      const isGrouped = groupedValues.includes(item.workType);
      const groupKey = isGrouped ? 'grouped' : item.workType;

      if (!acc[groupKey]) {
        acc[groupKey] = { workType: groupKey, count: 0 };
      }
      acc[groupKey].count += Number(item.count);

      if (isGrouped) {
        groupedCount += Number(item.count);
      }

      return acc;
    }, {});

    // Бүх ажилчдын тоололт
    const allCounts = Object.keys(workTypeLabels).map((workType) => ({
      workType,
      count: groupedCounts[workType]?.count || 0,
      label: workTypeLabels[workType] || 'Unknown',
    }));

    // Группчлагдсан тоололтыг нэмэх
    if (groupedCount > 0) {
      const existingGrouped = allCounts.find(
        (item) => item.workType === 'grouped',
      );
      if (existingGrouped) {
        existingGrouped.count = groupedCount;
      }
    }

    // gender тоололт
    const genderCounts = await getGenderCounts(entityManager, query);
    // Нийт тоололт
    const totalSum = getTotalSum(rawCounts, groupedValues);
    const employeeCounts = await getEmployeeTypeCounts(entityManager, query);
    const maritalStatus = await getMarriedCounts(entityManager, query);
    const ageCounts = await getAgeCounts(entityManager, query);
    const temporaryOptionsCounts = await getTemporaryOptionsCounts(
      entityManager,
      query,
    );
    const typeOfPositionCounts = await getTypeOfPositionCounts(
      entityManager,
      query,
    );
    const getAppointmentReportCounts = await getAppointmentReport(
      entityManager,
      query,
    );
    const getTreeReportCounts = await getTreePositionCounts(
      entityManager,
      query,
    );
    const newWorkerCount = await getNewWorkerCounts(entityManager, query);
    const closeWorkerCount = await getCloseWorkerCounts(entityManager, query);
    const getHolidayReportCounts = await getHolidayReport(entityManager, query);
    return {
      allCounts,
      totalSum,
      closeWorkerCount,
      newWorkerCount,
      genderCounts,
      employeeCounts,
      maritalStatus,
      ageCounts,
      temporaryOptionsCounts,
      typeOfPositionCounts,
      getAppointmentReportCounts,
      getHolidayReportCounts,
      getTreeReportCounts,
    };
  }

  // Гэрээний мэдээллийг авах
  async getAllContractDashboard(user: GetUserDto, query: GetDashboardDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);

    const [
      stateOneCount,
      isTimeTrueData,
      endDateWithin31To60Days,
      endDateWithin30Days,
      validContracts,
      contractTypeCount,
      contractStateCount,
    ] = await Promise.all([
      this.getContractCountByState(entityManager, 1, query),
      this.getContractCountByIsTime(entityManager, true, query),
      this.getContractCountByEndDateRange(entityManager, 30, 60, query),
      this.getContractCountByEndDateRange(entityManager, 0, 30, query),
      this.getValidContracts(entityManager, query),
      this.getContractTypeCount(entityManager, query),
      this.getContractStateCount(entityManager, query),
    ]);

    return {
      stateOneCount, // Баталгаажсан гэрээний тоо
      isTimeTrueData, // Хугацаагүй гэрээний тоо
      endDateWithin31To60Days, // Хугацаа дөхсөн <60
      endDateWithin30Days, // Хугацаа дөхсөн <30
      validContracts, // Хугацаандаа байгаа гэрээний тоо
      contractTypeCount, // Гэрээний төрлөөр бүлэглэх
      contractStateCount,
      contractTypes: await getContractTypes(entityManager, query),
    };
  }

  private async getContractCountByState(
    entityManager: EntityManager,
    state: number,
    query: GetDashboardDto,
  ) {
    let queryBuilder = entityManager
      .createQueryBuilder(Contract, 'contract_i')
      .select('COUNT(*)', 'count')
      .addSelect('SUM(contract_i.payment)', 'totalPayment')
      .where('contract_i.state = :state', { state })
      .andWhere('contract_i.deleted_at IS NULL');

    queryBuilder = this.applyFilters(queryBuilder, query);
    return queryBuilder.getRawOne();
  }

  private async getContractCountByIsTime(
    entityManager: EntityManager,
    isTime: boolean,
    query: GetDashboardDto,
  ) {
    let queryBuilder = entityManager
      .createQueryBuilder(Contract, 'contract_i')
      .select('COUNT(*)', 'count')
      .addSelect('SUM(contract_i.payment)', 'totalPayment')
      .where('contract_i.isTime = :isTime', { isTime })
      .andWhere('contract_i.deleted_at IS NULL')
      .andWhere('contract_i.state = :state', { state: 1 });

    queryBuilder = this.applyFilters(queryBuilder, query);
    return queryBuilder.getRawOne();
  }

  private async getContractTypeCount(
    entityManager: EntityManager,
    query: GetDashboardDto,
  ) {
    let queryBuilder = entityManager
      .createQueryBuilder(Contract, 'contract_i')
      .select('type.name', 'name') // Гэрээний төрөл
      .addSelect('COUNT(*)', 'count') // Тухайн төрлийн нийт тоо
      .addSelect('SUM(contract_i.payment)', 'totalPayment') // Тухайн төрлийн нийт төлбөр
      .innerJoin('contract_i.type', 'type') // Гэрээний төрөлтэй холбох
      .where('contract_i.deleted_at IS NULL')
      .andWhere('contract_i.state = :state', { state: 1 })
      .groupBy('type.name'); //  Гэрээний төрлөөр бүлэглэх

    queryBuilder = this.applyFilters(queryBuilder, query);
    const contractTypeCounts = await queryBuilder.getRawMany(); //  Олон мөр буцаах

    //  Бүх гэрээний нийт тоо болон нийт төлбөрийг авах
    let allContractsQuery = entityManager
      .createQueryBuilder(Contract, 'contract_i')
      .select('COUNT(*)', 'allCount')
      .addSelect('SUM(contract_i.payment)', 'allTotalPayment')
      .where('contract_i.deleted_at IS NULL')
      .andWhere('contract_i.state = :state', { state: 1 });

    allContractsQuery = this.applyFilters(allContractsQuery, query);
    const allContracts = await allContractsQuery.getRawOne();

    return {
      allCount: allContracts.allCount, //  Нийт гэрээний тоо
      allTotalPayment: allContracts.allTotalPayment, //  Нийт төлбөр
      contractTypes: contractTypeCounts, //  Гэрээний төрлүүдээр бүлэглэсэн өгөгдөл
    };
  }

  private async getContractStateCount(
    entityManager: EntityManager,
    query: GetDashboardDto,
  ) {
    let queryBuilder = entityManager
      .createQueryBuilder(Contract, 'contract_i')
      .select('contract_i.state', 'state') // Group by state
      .addSelect('COUNT(*)', 'count') // Count of contracts
      .addSelect('SUM(contract_i.payment)', 'totalPayment') // Total payment
      .where('contract_i.deleted_at IS NULL');

    // Apply filters if necessary
    queryBuilder = this.applyFilters(queryBuilder, query);

    // Group by state to get counts and totals per state
    queryBuilder.groupBy('contract_i.state');

    // Fetch grouped data
    const contractStateCounts = await queryBuilder.getRawMany();

    // Calculate total count and payment for all states
    const totalCount = contractStateCounts.reduce(
      (sum, item) => sum + parseInt(item.count, 10),
      0,
    );
    const totalPayment = contractStateCounts.reduce(
      (sum, item) => sum + parseFloat(item.totalPayment || 0),
      0,
    );

    // Return the grouped data along with total stats
    return {
      allCount: totalCount, // Total number of contracts
      allTotalPayment: totalPayment, // Total payment
      states: contractStateCounts, // Grouped data by state
    };
  }

  private async getContractCountByEndDateRange(
    entityManager: EntityManager,
    startDays: number,
    endDays: number,
    query: GetDashboardDto,
  ) {
    const startDate = new Date(
      new Date().getTime() + startDays * 24 * 60 * 60 * 1000,
    );
    const endDate = new Date(
      new Date().getTime() + endDays * 24 * 60 * 60 * 1000,
    );

    let queryBuilder = entityManager
      .createQueryBuilder(Contract, 'contract_i')
      .select('COUNT(*)', 'count')
      .addSelect('SUM(contract_i.payment)', 'totalPayment')
      .where('contract_i.end_date > :startDate', { startDate })
      .andWhere('contract_i.end_date <= :endDate', { endDate })
      .andWhere('contract_i.deleted_at IS NULL')
      .andWhere('contract_i.state = :state', { state: 1 })
      .andWhere('contract_i.isTime = :isTime', { isTime: false });

    queryBuilder = this.applyFilters(queryBuilder, query);
    return queryBuilder.getRawOne();
  }

  private async getValidContracts(
    entityManager: EntityManager,
    query: GetDashboardDto,
  ) {
    const sixtyDaysLater = new Date(
      new Date().getTime() + 60 * 24 * 60 * 60 * 1000,
    );

    let queryBuilder = entityManager
      .createQueryBuilder(Contract, 'contract_i')
      .select('COUNT(*)', 'count')
      .addSelect('SUM(contract_i.payment)', 'totalPayment')
      .where('contract_i.end_date > :sixtyDaysLater', { sixtyDaysLater })
      .andWhere('contract_i.deleted_at IS NULL')
      .andWhere('contract_i.state = :state', { state: 1 })
      .andWhere('contract_i.isTime = :isTime', { isTime: false });

    queryBuilder = this.applyFilters(queryBuilder, query);
    return queryBuilder.getRawOne();
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<Contract>,
    query: GetDashboardDto,
  ) {
    if (query.isSchedule) {
      queryBuilder.andWhere('contract_i.isSchedule = :isSchedule', {
        isSchedule: query.isSchedule,
      });
    }
    if (query.isWarranty) {
      queryBuilder.andWhere('contract_i.isWarranty = :isWarranty', {
        isWarranty: query.isWarranty,
      });
    }
    if (query.isCertificate) {
      queryBuilder.andWhere('contract_i.isCertificate = :isCertificate', {
        isCertificate: query.isCertificate,
      });
    }
    if (query.isUniqueValue) {
      queryBuilder.andWhere('contract_i.isUniqueValue = :isUniqueValue', {
        isUniqueValue: query.isUniqueValue,
      });
    }
    if (query.typeId) {
      queryBuilder.andWhere('contract_i.typeId = :typeId', {
        typeId: query.typeId,
      });
    }
    return queryBuilder;
  }
}
