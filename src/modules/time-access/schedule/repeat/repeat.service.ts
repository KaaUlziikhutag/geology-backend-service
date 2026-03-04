import { Injectable } from '@nestjs/common';
import { CreateRepeatDto } from './dto/create-repeat.dto';
import { UpdateRepeatDto } from './dto/update-repeat.dto';
import { GetRepeatDto } from './dto/get-repeat.dto';
import { Between, Equal, FindManyOptions, ILike, Repository } from 'typeorm';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Repeats from './entities/repeat.entity';
import RepeatNotFoundException from './exceptions/repeat-not-found.exception';
import { RepeatDetailService } from './detail/repeat-detail.service';
import { AppointmentStatusType } from '@utils/enum-utils';
import RepeatHistory from './entities/repeat-history.entity';
import IUser from '@modules/users/interface/user.interface';

@Injectable()
export class RepeatService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(Repeats)
    private readonly repeatRepository: Repository<Repeats>,
    @InjectRepository(RepeatHistory)
    private readonly repeatHistoryRepository: Repository<RepeatHistory>,
    private readonly repeatDetailService: RepeatDetailService,
  ) {}

  async getAllRepeat(query: GetRepeatDto) {
    const where: FindManyOptions<Repeats>['where'] = {};
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
    if (query.name) {
      where.name = ILike('%' + query.name + '%');
    }
    if (query.currentAt) {
      const currentDate = new Date(query.currentAt);
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
      );
      where.createdAt = Between(startOfMonth, endOfMonth);
    }
    if (query.userId) {
      where.confirmId = Equal(query.userId);
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
    const [items, count] = await this.repeatRepository.findAndCount({
      where,
      order: {
        createdAt: 'DESC',
      },
      relations: ['repeatDetails.graphic.graphicStep', 'repeatSchedules'],
      skip: skip,
      take: limit,
    });
    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  async getShiftRepeat(query: GetRepeatDto) {
    const where: FindManyOptions<RepeatHistory>['where'] = {};
    if (query.comId) {
      where.comId = Equal(query.comId);
    }
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
    const [items, count] = await this.repeatHistoryRepository.findAndCount({
      where,
      order: {
        createdAt: 'DESC',
      },
      relations: ['author.humans', 'confirm.humans'],
      skip: skip,
      take: limit,
    });
    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  async getRepeatById(repeatId: number): Promise<Repeats> {
    const repeat = await this.repeatRepository.findOne({
      where: { id: repeatId },
      relations: [
        'repeatDetails',
        'repeatDetails.graphic',
        'repeatDetails.viewUsers.worker.humans',
        'confirmWorker.humans',
      ],
    });

    if (repeat) {
      return repeat;
    }
    throw new RepeatNotFoundException(repeatId);
  }

  async createRepeat(repeat: CreateRepeatDto) {
    console.log('=================>repeat', repeat.startDate, repeat.endDate);
    if (
      repeat.startDate &&
      repeat.startDateHour != null &&
      repeat.startDateMinute != null
    ) {
      repeat.startDate = new Date(
        Date.UTC(
          new Date(repeat.startDate).getUTCFullYear(),
          new Date(repeat.startDate).getUTCMonth(),
          new Date(repeat.startDate).getUTCDate(),
          repeat.startDateHour,
          repeat.startDateMinute,
          0,
          0,
        ),
      );
    }
    if (
      repeat.endDate &&
      repeat.endDateHour != null &&
      repeat.endDateMinute != null
    ) {
      repeat.endDate = new Date(
        Date.UTC(
          new Date(repeat.endDate).getUTCFullYear(),
          new Date(repeat.endDate).getUTCMonth(),
          new Date(repeat.endDate).getUTCDate(),
          repeat.endDateHour,
          repeat.endDateMinute,
          0,
          0,
        ),
      );
    }
    const newRepeat = this.repeatRepository.create(repeat);
    console.log('==================>newRepeat', newRepeat);
    await this.repeatRepository.save(newRepeat);
    if (repeat.detail) {
      const repeatDetail = await Promise.all(
        repeat.detail.map(async (repeatDetail) =>
          this.repeatDetailService.createRepeatDetail({
            ...repeatDetail,
            repeatId: newRepeat.id,
          }),
        ),
      );
      await this.repeatRepository.save(repeatDetail);
    }
    return newRepeat;
  }

  async updateRepeat(
    repeatId: number,
    repeat: UpdateRepeatDto,
  ): Promise<Repeats> {
    const { detail, ...repeatData } = repeat;
    await this.repeatRepository.update(repeatId, repeatData);
    const updatedRepeat = await this.repeatRepository.findOne({
      where: { id: repeatId },
    });
    if (!updatedRepeat) {
      throw new RepeatNotFoundException(repeatId);
    }
    if (detail?.length) {
      await Promise.all(
        detail.map((item) =>
          this.repeatDetailService.updateMultipleRepeatDetails([
            { ...item, repeatId },
          ]),
        ),
      );
    }
    return updatedRepeat;
  }

  async updateRepeatConfirm(
    ids: number[],
    user: IUser,
    repeat: UpdateRepeatDto,
  ): Promise<Repeats[]> {
    repeat.status = AppointmentStatusType.Comfirm;
    const updatedRepeats: Repeats[] = [];
    for (const id of ids) {
      await this.repeatRepository.update(id, repeat);
      const updatedRepeat = await this.repeatRepository.findOne({
        where: { id },
      });
      if (!updatedRepeat) {
        throw new RepeatNotFoundException(id);
      }
      const newRepeatHistory = this.repeatHistoryRepository.create({
        repeatId: updatedRepeat.id,
        comId: null,
        status: updatedRepeat.status,
        authorId: user.id,
        confirmId: user.id,
        confirmDate: new Date(),
      });
      await this.repeatHistoryRepository.save(newRepeatHistory);
      updatedRepeats.push(updatedRepeat);
    }
    return updatedRepeats;
  }

  async updateRepeatCancelled(
    ids: number[],
    user: IUser,
    repeat: UpdateRepeatDto,
  ): Promise<Repeats[]> {
    repeat.status = AppointmentStatusType.Cancelled;
    const updatedRepeats: Repeats[] = [];
    for (const id of ids) {
      await this.repeatRepository.update(id, repeat);
      const updatedRepeat = await this.repeatRepository.findOne({
        where: { id },
      });
      if (!updatedRepeat) {
        throw new RepeatNotFoundException(id);
      }
      const newRepeatHistory = this.repeatHistoryRepository.create({
        repeatId: updatedRepeat.id,
        comId: null,
        status: updatedRepeat.status,
        authorId: user.id,
        confirmId: user.id,
        closeNote: repeat.closeNote,
        confirmDate: new Date(),
      });
      await this.repeatHistoryRepository.save(newRepeatHistory);
      updatedRepeats.push(updatedRepeat);
    }
    return updatedRepeats;
  }

  async updateRepeatTransfer(
    ids: number[],
    user: IUser,
    repeat: UpdateRepeatDto,
  ): Promise<Repeats[]> {
    const updatedRepeats: Repeats[] = [];
    for (const id of ids) {
      repeat.status = AppointmentStatusType.Expected;
      await this.repeatRepository.update(id, repeat);
      const updatedRepeat = await this.repeatRepository.findOne({
        where: { id },
      });
      if (!updatedRepeat) {
        throw new RepeatNotFoundException(id);
      }
      const reveiverData = await this.repeatHistoryRepository.findOne({
        where: {
          repeatId: id,
          status: AppointmentStatusType.Expected,
        },
        order: {
          createdAt: 'DESC',
        },
      });
      if (!reveiverData) {
        throw new Error(
          `Receiver data not found for appointment with ID ${id}`,
        );
      }
      const newRepeatHistory = this.repeatHistoryRepository.create({
        repeatId: updatedRepeat.id,
        comId: null,
        status: AppointmentStatusType.Transfer,
        authorId: user.id,
        confirmId: reveiverData.confirmId,
        closeNote: repeat.closeNote,
        confirmDate: new Date(),
      });
      await this.repeatHistoryRepository.save(newRepeatHistory);

      const newRepeatHistoryData = this.repeatHistoryRepository.create({
        repeatId: updatedRepeat.id,
        comId: null,
        status: AppointmentStatusType.Expected,
        authorId: user.id,
        confirmId: repeat.confirmId,
        closeNote: repeat.closeNote,
        confirmDate: new Date(),
      });
      await this.repeatHistoryRepository.save(newRepeatHistoryData);
      updatedRepeats.push(updatedRepeat);
    }
    return updatedRepeats;
  }

  async deleteRepeatById(id: number): Promise<void> {
    return this.deleteRepeat(id);
  }

  async deleteRepeat(id: number): Promise<void> {
    const deleteResponse = await this.repeatRepository.softDelete(id);
    if (!deleteResponse.affected) {
      throw new RepeatNotFoundException(id);
    }
  }
}
