import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Task from './task.entity';
import { Equal, FindManyOptions, In, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import GetUserDto from '../users/dto/get-user.dto';
import TaskNotFoundException from './exceptions/task-not-found.exception';
import { GetTaskDto } from './dto/get-task.dto';
import PageDto from '../../utils/dto/page.dto';
import PageMetaDto from '../../utils/dto/page-meta.dto';
import UpdateTaskDto from './dto/update-task.dto';
import { OrderState, TaskState } from '../../utils/enum-utils';
import { MineralState, ProductType } from '../../utils/enum-utils';
import { MineralService } from '../appointment/mineral/mineral.service';
import { GetAnalyticTaskDto } from './dto/get-analytic-task.dto';
import { BarcodeService } from '../barcode/barcode.service';
import { TaskUsersDto } from './dto/task-users.dto';
import { UsersService } from '../users/users.service';
import IUser from '@modules/users/interface/user.interface';
@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly mineralService: MineralService,
    private readonly userService: UsersService,
    private readonly barcodeService: BarcodeService,
  ) {}

  async createTask(user: IUser, task: CreateTaskDto): Promise<Task> {
    const { barcode } = await this.barcodeService.getBarcode();
    const newTask = this.taskRepository.create({
      ...task,
      createdBy: user.id,
      barcode,
    });
    await this.barcodeService.updateBarcode(barcode);
    return await this.taskRepository.save(newTask);
  }
  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['mineral.mineralType', 'order.price.product'],
    });
    if (!task) {
      throw new TaskNotFoundException(id);
    }
    return task;
  }
  async getTasks(query: GetTaskDto): Promise<PageDto<Task>> {
    const { page, skip, limit, order } = query;
    const where: FindManyOptions<Task>['where'] = {
      order: { state: OrderState.Approved },
    };
    if (query.barcode) {
      where.barcode = Equal(query.barcode);
    }
    if (query.state) {
      where.state = Equal(query.state);
    }
    if (query.laboratoryId) {
      where.order = {
        price: {
          laboratoryId: Equal(query.laboratoryId),
        },
      };
    }
    if (query.mineralStates) {
      where.mineral = { state: In(query.mineralStates) };
    }
    if (query.userId) {
      where.users = { id: query.userId };
    }
    const [data, total] = await this.taskRepository.findAndCount({
      where,
      relations: ['mineral.mineralType', 'order.price.product', 'users'],
      take: limit,
      skip,
      order: { createdAt: order },
    });
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount: total });
    return new PageDto(data, pageMetaDto);
  }
  async getAnalyticTasks(query: GetAnalyticTaskDto): Promise<Task[]> {
    const qb = this.taskRepository.createQueryBuilder('task');
    qb.leftJoinAndSelect('task.order', 'order');
    qb.leftJoinAndSelect('task.mineral', 'mineral');
    qb.leftJoinAndSelect('mineral.mineralType', 'mineralType');
    qb.leftJoinAndSelect('order.price', 'price');
    qb.leftJoinAndSelect('price.laboratory', 'laboratory');
    qb.leftJoinAndSelect('price.product', 'product');
    qb.leftJoinAndSelect('product.section', 'section');
    qb.leftJoinAndSelect('price.mineralType', 'priceMineralType');
    qb.leftJoinAndSelect('price.element', 'element');
    qb.leftJoinAndSelect('price.technology', 'technology');
    qb.where('order.createdAt BETWEEN :startDate AND :endDate', {
      startDate: query.orderAt.startAt,
      endDate: query.orderAt.endAt,
    });
    qb.addGroupBy('task.id');
    qb.addGroupBy('mineral.id');
    qb.addGroupBy('order.id');
    qb.addGroupBy('price.id');
    qb.addGroupBy('laboratory.id');
    qb.addGroupBy('product.id');
    qb.addGroupBy('section.id');
    qb.addGroupBy('mineralType.id');
    qb.addGroupBy('priceMineralType.id');
    qb.addGroupBy('element.id');
    qb.addGroupBy('technology.id');
    qb.having(`Count(order.id) ${query.operator} :orderCount`, {
      orderCount: query.orderCount,
    });
    if (query.mineralTypeId) {
      qb.andWhere('priceMineralType.id = :priceMineralTypeId', {
        priceMineralTypeId: query.mineralTypeId,
      });
    }
    if (query.productId) {
      qb.andWhere('product.id = :productId', {
        productId: query.productId,
      });
    }
    return await qb.getMany();
  }

  async updateTask(
    user: IUser,
    id: number,
    task: UpdateTaskDto,
  ): Promise<Task> {
    const updatedTask = await this.getTaskById(id);
    if (
      task.state === TaskState.Completed &&
      updatedTask.order.price.product.type === ProductType.variable
    ) {
      const mineral = await this.mineralService.updateMineral(
        updatedTask.mineralId,
        {
          state: MineralState.analytic,
          id: updatedTask.mineralId,
        },
      );
      updatedTask.mineral = mineral;
    }
    updatedTask.updatedBy = user.id;
    updatedTask.state = task.state;
    return await this.taskRepository.save(updatedTask);
  }

  async deleteTask(id: number): Promise<void> {
    const deleteResponse = await this.taskRepository.softDelete(id);
    if (!deleteResponse.affected) {
      throw new TaskNotFoundException(id);
    }
  }
  async getTaskByIds(ids: number[]): Promise<Task[]> {
    return this.taskRepository.findBy({ id: In(ids) });
  }
  async scheduleTask(taskUser: TaskUsersDto): Promise<Task[]> {
    const tasks = await this.getTaskByIds(taskUser.taskIds);
    const users = await this.userService.getByIds(taskUser.userIds);
    tasks.forEach((task) => {
      // task.users = users.map((item) => ({
      //   taskId: task.id,
      //   userId: item.id,
      //   user: item,
      // }));
    });
    return await this.taskRepository.save(tasks);
  }
}
