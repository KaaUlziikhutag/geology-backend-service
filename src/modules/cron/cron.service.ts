import { Between, EntityManager, FindManyOptions, LessThan } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import Holiday from '../human-resource/holiday/entities/holiday.entity';
import { ScheduleStatus, WorkType } from '@utils/enum-utils';
import Worker from '../human-resource/member/worker/worker.entity';
import Appointments from '../human-resource/appointment/entities/appointment.entity';
import RepeatDetails from '../time-access/schedule/repeat/detail/entities/repeat-detail.entity';
import { RepeatScheduleService } from '../time-access/schedule/repeat/schedule/schedule.service';
import Directs from '../time-access/schedule/direct/entities/direct.entity';
import { DirectScheduleService } from '../time-access/schedule/direct/schedule/schedule.service';
import { CompaniesService } from '../cloud/company/companies.service';
import Companies from '../cloud/company/companies.entity';
import Repeats from '../time-access/schedule/repeat/entities/repeat.entity';
import AccessTimes from '../time-access/access/entities/access-time.entity';
import DirectSchedules from '../time-access/schedule/direct/schedule/schedule.entity';
import RepeatSchedules from '../time-access/schedule/repeat/schedule/schedule.entity';
import { calculateAttendanceStatus } from '@utils/helper-utils';

@Injectable()
export class CronJobService {
  logger: any;
  constructor(
    private moduleRef: ModuleRef,
    private readonly companiesService: CompaniesService,
    private readonly repeatScheduleService: RepeatScheduleService,
    private readonly directScheduleService: DirectScheduleService,
  ) {}
  private async loadEntityManager(systemId: string): Promise<EntityManager> {
    return this.moduleRef.get(getEntityManagerToken(`ioffice_${systemId}`), {
      strict: false,
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async holidayUpdateData() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const where: FindManyOptions<Holiday>['where'] = {
      endDay: Between(today, tomorrow),
    };
    const companies = await this.companiesService.getAllCompany();
    for (const company of companies) {
      const entityManager = await this.loadEntityManager(company.dataBase);
      const holidays = await entityManager.find(Holiday, { where });
      for (const holiday of holidays) {
        holiday.workerType = WorkType.Active;
        const entityManager = await this.loadEntityManager(company.dataBase);
        await entityManager.save(Holiday, holiday);
        for (const workerId of holiday.workerIds) {
          await entityManager.update(
            Worker,
            { id: workerId },
            {
              workerType: holiday.workerType,
            },
          );
        }
      }
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async appointmentUpdateData() {
    const companies = await this.companiesService.getAllCompany();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const where: FindManyOptions<Appointments>['where'] = {
      endDate: Between(today, tomorrow),
    };
    for (const company of companies) {
      const entityManager = await this.loadEntityManager(company.dataBase);
      const appointments = await entityManager.find(Appointments, { where });
      for (const appointment of appointments) {
        appointment.workerType = WorkType.Active;
        const entityManager = await this.loadEntityManager(company.dataBase);
        await entityManager.save(Appointments, appointment);
        for (const workerId of appointment.workerIds) {
          await entityManager.update(
            Worker,
            { id: workerId },
            {
              workerType: appointment.workerType,
            },
          );
        }
      }
      console.log('Cron job is holiday running every 11-pm hour');
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async appointmentUpdateWorkerType() {
    const companies = await this.companiesService.getAllCompany();
    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0); // Өнөөдөр 00:00:00 цаг
    const endToday = new Date();
    endToday.setHours(23, 59, 59, 999); // Өнөөдөр 23:59:59.999 цаг
    const where: FindManyOptions<Appointments>['where'] = {
      startDate: Between(startToday, endToday),
    };
    for (const company of companies) {
      const entityManager = await this.loadEntityManager(company.dataBase);
      const appointments = await entityManager.find(Appointments, { where });
      for (const appointment of appointments) {
        appointment.workerType = WorkType.Appointment;
        for (const workerId of appointment.workerIds) {
          await entityManager.update(
            Worker,
            { id: workerId },
            {
              workerType: appointment.workerType,
            },
          );
        }
      }
      console.log('Cron job is holiday running every 11-pm hour');
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async holidayUpdateWorkerType() {
    const companies = await this.companiesService.getAllCompany();
    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0); // Өнөөдөр 00:00:00 цаг
    const endToday = new Date();
    endToday.setHours(23, 59, 59, 999); // Өнөөдөр 23:59:59.999 цаг
    const where: FindManyOptions<Holiday>['where'] = {
      endDay: Between(startToday, endToday),
    };
    for (const company of companies) {
      const entityManager = await this.loadEntityManager(company.dataBase);
      const holidays = await entityManager.find(Holiday, { where });
      for (const holiday of holidays) {
        await entityManager.save(Holiday, holiday);
        for (const workerId of holiday.workerIds) {
          await entityManager.update(
            Worker,
            { id: workerId },
            {
              workerType: holiday.workerType,
            },
          );
        }
      }
    }
    console.log('Cron job is holiday running every 11-pm hour');
  }

  // Шугман хуваарь шинээр үүсгэнэ
  @Cron(CronExpression.EVERY_DAY_AT_10PM)
  async setDirectScheduleAccess() {
    console.log('Running setDirectScheduleAccess at 11AM every day');
    const companies = await this.companiesService.getAllCompany();
    const startDate = new Date(); // өнөөдөр
    startDate.setHours(0, 0, 0, 0); // 00:00:00 болгож тохируулна
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 3); // 3 хоног нэмнэ
    endDate.setHours(23, 59, 59, 999); // 3 дахь өдрийн төгсгөл
    const whereClause: FindManyOptions<Directs>['where'] = {
      insertDate: Between(startDate, endDate),
    };
    for (const company of companies) {
      try {
        const entityManager = await this.loadEntityManager(company.dataBase);
        const direct = await entityManager.find(Directs, {
          where: whereClause,
          relations: ['mainSchedules', 'viewUsers'],
        });
        if (direct.length === 0) continue;
        await this.processDirectDetails(direct, company);
      } catch (error) {
        console.log(
          `Failed to process company ${company.id}: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        );
      }
    }
  }
  private async processDirectDetails(directs: Directs[], companies: Companies) {
    for (const direct of directs) {
      await this.directScheduleService.createDirectScheduleCron(
        direct, // Шууд direct entity-г дамжуулна
        companies.dataBase,
      );
    }
  }

  // Ээлжийн хуваарь шинээр үүсгэнэ
  @Cron(CronExpression.EVERY_DAY_AT_10PM)
  async setRepeatScheduleAccess() {
    console.log('Running setRepeatScheduleAccess');
    const companies = await this.companiesService.getAllCompany();
    const startDate = new Date(); // өнөөдөр
    startDate.setHours(0, 0, 0, 0); // Локал цаг
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 3); // 3 хоногийн дараа
    endDate.setHours(23, 59, 59, 999);
    const whereClause: FindManyOptions<Repeats>['where'] = {
      startDate: Between(startDate, endDate),
    };
    for (const company of companies) {
      try {
        const entityManager = await this.loadEntityManager(company.dataBase);
        const repeats = await entityManager.find(Repeats, {
          where: whereClause,
          relations: [
            'repeatDetails',
            'repeatDetails.viewUsers',
            'repeatDetails.graphic',
            'repeatDetails.graphic.graphicStep',
            'repeatDetails.repeats',
          ],
        });
        if (repeats.length === 0) {
          continue;
        }
        const allRepeatDetails = repeats.flatMap((r) => r.repeatDetails || []);
        if (allRepeatDetails.length === 0) {
          continue;
        }
        await this.processRepeatDetails(allRepeatDetails);
      } catch (error) {
        console.error(
          `Failed to process company ${company.id}: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        );
      }
    }
  }
  private async processRepeatDetails(repeatDetails: RepeatDetails[]) {
    for (const repeatDetail of repeatDetails) {
      await this.repeatScheduleService.createRepeatScheduleCron(repeatDetail);
    }
  }

  // шугман хуваарийн ирсэн явсан цаг set хийж байна
  @Cron(CronExpression.EVERY_DAY_AT_10PM)
  async setTimeDirectAccess() {
    console.log('Cron job started: setTimeAccess');
    const startTime = performance.now();
    try {
      const companies = await this.companiesService.getAllCompany();
      if (!companies.length) {
        console.log('No companies found, exiting cron job');
        return;
      }
      const todayStart = new Date();
      todayStart.setUTCHours(0, 0, 0, 0);
      const todayEnd = new Date(todayStart);
      todayEnd.setUTCHours(23, 59, 59, 999);
      console.log('Today start:', todayStart);
      console.log('Today end:', todayEnd);
      for (const company of companies) {
        await this.processCompanyAccessTimes(company, todayStart, todayEnd);
      }
      const executionTime = ((performance.now() - startTime) / 1000).toFixed(2);
      console.log(
        `Cron job completed successfully in ${executionTime} seconds`,
      );
    } catch (error) {
      console.error(
        'Error in setTimeAccess cron job:',
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }
  private async processCompanyAccessTimes(
    company: Companies,
    todayStart: Date,
    todayEnd: Date,
  ) {
    console.log(`Processing company ${company.id}`);
    const entityManager = await this.loadEntityManager(company.dataBase);
    try {
      const accessTimes = await entityManager.find(AccessTimes, {
        where: {
          date: Between(todayStart, todayEnd),
        },
        order: { date: 'ASC' }, // Sort ascending to easily get first/last
      });
      if (!accessTimes.length) {
        console.log(`No access times found for company ${company.id}`);
        return;
      }
      const userAccessMap = new Map<number, AccessTimes[]>();
      for (const accessTime of accessTimes) {
        const userAccess = userAccessMap.get(accessTime.userId) || [];
        userAccess.push(accessTime);
        userAccessMap.set(accessTime.userId, userAccess);
      }
      for (const [userId, userAccessTimes] of userAccessMap) {
        await this.processUserAccessTimes(
          entityManager,
          userId,
          userAccessTimes,
          todayStart,
        );
      }
    } catch (error) {
      console.error(
        `Error processing company ${company.id}:`,
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }
  private async processUserAccessTimes(
    entityManager: EntityManager,
    userId: number,
    accessTimes: AccessTimes[],
    todayStart: Date,
  ) {
    const earliestAccess = accessTimes[0];
    const latestAccess = accessTimes[accessTimes.length - 1];
    const formatTime = (date: Date): string => {
      return `${date.getHours().toString().padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    };
    const directSchedule = await entityManager.findOne(DirectSchedules, {
      where: { userId, date: todayStart },
    });
    if (!directSchedule) {
      console.log(
        `No direct schedule found for user ${userId} on ${todayStart.toISOString()}`,
      );
      return;
    }
    const time1 = formatTime(earliestAccess.date);
    const time2 = formatTime(latestAccess.date);
    const attendance = calculateAttendanceStatus(
      time1,
      time2,
      directSchedule.startTime,
      directSchedule.endTime,
    );
    const scheduleStatus = attendance.isAbsent
      ? ScheduleStatus.OnLeave
      : ScheduleStatus.Ongoing;
    await entityManager.update(
      DirectSchedules,
      { userId, date: todayStart },
      {
        time1,
        time2,
        lostTime1: attendance.lostTime1,
        lostTime2: attendance.lostTime2,
        overTime1: attendance.overTime1,
        overTime2: attendance.overTime2,
        isAbsent: attendance.isAbsent,
        scheduleStatus,
        updatedAt: new Date(),
      },
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_10PM)
  async setTimeRepeatAccess() {
    console.log('Running setTimeAccess');
    const companies = await this.companiesService.getAllCompany();
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setUTCHours(23, 59, 59, 999);
    for (const company of companies) {
      try {
        const entityManager = await this.loadEntityManager(company.dataBase);
        const repeatSchedules = await entityManager.find(RepeatSchedules, {
          where: {
            startDate: Between(startOfToday, endOfToday),
          },
        });
        for (const schedule of repeatSchedules) {
          const { userId, startDate, endDate } = schedule;
          const overtimeBufferHours = 2;
          const adjustedEndDate = new Date(endDate);
          adjustedEndDate.setHours(
            adjustedEndDate.getHours() + overtimeBufferHours,
          );
          const accessTimes = await entityManager.find(AccessTimes, {
            where: {
              userId,
              date: LessThan(adjustedEndDate),
            },
            order: { date: 'ASC' },
          });
          if (accessTimes.length === 0) continue;
          const filteredTimes = accessTimes.filter(
            (at) =>
              at.date >= new Date(startDate) && at.date <= adjustedEndDate,
          );
          if (filteredTimes.length === 0) continue;
          const time1 = filteredTimes[0].date.toTimeString();
          const time2 =
            filteredTimes[filteredTimes.length - 1].date.toTimeString();
          const attendance = calculateAttendanceStatus(
            time1,
            time2,
            schedule.startTime,
            schedule.endTime,
          );
          const scheduleStatus = attendance.isAbsent
            ? ScheduleStatus.OnLeave
            : ScheduleStatus.Ongoing;
          await entityManager.update(
            RepeatSchedules,
            { id: schedule.id },
            {
              time1,
              time2,
              lostTime1: attendance.lostTime1,
              lostTime2: attendance.lostTime2,
              overTime1: attendance.overTime1,
              overTime2: attendance.overTime2,
              scheduleStatus,
            },
          );
        }
      } catch (error) {
        console.error(
          `Failed to process company ${company.id}: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        );
      }
    }
  }
}
