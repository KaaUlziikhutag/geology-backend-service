import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Order from './order.entity';
import {
  Between,
  Equal,
  FindManyOptions,
  In,
  IsNull,
  Repository,
} from 'typeorm';
import CreateOrderDto from './dto/create-order.dto';
import { MineralService } from '../appointment/mineral/mineral.service';
import GetOrderDto from './dto/get-order.dto';
import OrderNotFoundException from './exceptions/order-not-found.exception';
import { ContractService } from '../contract/contract.service';
import { MineralState, OrderState, Role } from '../../utils/enum-utils';
import { AppointmentService } from '../appointment/appointment.service';
import { PriceService } from '../price/price.service';
import { CompleteOrderDto } from './dto/complete-order.dto';
import GetUserDto from '../users/dto/get-user.dto';
import { CreateReceiveDto } from './dto/create-receive.dto';
import { NotificationService } from '../notification/notifcation.service';
import { UsersService } from '../users/users.service';
import { TaskService } from '../task/task.service';
import { CreateAnalystOrderDto } from './dto/create-analyst-order.dto';
import { GetAnalyticTaskDto } from '../task/dto/get-analytic-task.dto';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly mineralService: MineralService,
    private readonly contractService: ContractService,
    private readonly appointmentService: AppointmentService,
    private readonly priceService: PriceService,
    private readonly usersService: UsersService,
    private readonly notificationService: NotificationService,
    private readonly taskService: TaskService,
  ) {}

  async createOrder(user: IUser, order: CreateOrderDto): Promise<Order> {
    const appointment = await this.appointmentService.getAppointmentById(
      order.appointmentId,
    );
    const price = await this.priceService.getPriceById(order.priceId);
    const minerals = await this.mineralService.getMineralByIds(
      order.mineralIds,
    );
    // const contract = await this.contractService.getValidContract({
    //   customerId: appointment.customerId,
    //   productIds: [price.product.id],
    // });
    const totalAmount = Math.floor(price.amount) * minerals.length;
    // if (contract) {
    //   const orders = await this.getOrders(user, {
    //     customerId: appointment.customerId,
    //   });
    //   const usedAmount = orders.reduce(
    //     (total, item) => total + Math.floor(item.totalAmount),
    //     0,
    //   );
    //   if (usedAmount < totalAmount) {
    //     throw 'Гэрээнд заасан дүнгээс хэтэрч байна!';
    //   }
    // }
    const newOrder = this.orderRepository.create({
      appointmentId: order.appointmentId,
      priceId: price.id,
      quantity: minerals.length,
      unitPrice: Math.floor(price.amount),
      paidAmount: totalAmount,
      totalAmount,
      createdBy: user.id,
    });
    await this.orderRepository.save(newOrder);
    for await (const mineral of minerals) {
      await this.taskService.createTask(user, {
        orderId: newOrder.id,
        mineralId: mineral.id,
        isDuplicate: false,
      });
    }
    return newOrder;
  }

  async getOrders(user: IUser, query: GetOrderDto): Promise<Order[]> {
    const where: FindManyOptions<Order>['where'] = {};
    // if (user.role !== Role.Engineer) {
    //   where.createdBy = user.id;
    // }
    if (query.createdAt) {
      where.createdAt = Between(query.createdAt.startAt, query.createdAt.endAt);
    }
    if (query.appointmentId) {
      where.appointmentId = Equal(query.appointmentId);
    }
    if (query.customerId) {
      where.appointment = {
        customerId: Equal(query.customerId),
      };
    }
    if (query.sectionId) {
      where.price = {
        product: {
          // sectionId: Equal(query.sectionId),
        },
      };
    }
    if (query.state) {
      where.state = Equal(query.state);
    }
    return await this.orderRepository.find({
      where,
      relations: [
        'appointment',
        'payment',
        'price',
        'price.laboratory',
        'price.product',
        'price.mineralType',
        'price.element',
        'price.technology',
        'tasks',
        'tasks.mineral',
      ],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getOrderByIds(ids: number[]): Promise<Order[]> {
    const orders = await this.orderRepository.find({
      where: { id: In(ids) },
      relations: ['price', 'price.product'],
    });
    if (orders.length == 0) {
      throw new NotFoundException(`Order with ids: ${ids} not found`);
    }
    return orders;
  }

  async deleteOrder(id: number): Promise<void> {
    const deleteResponse = await this.orderRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new OrderNotFoundException(id);
    }
  }
  async receiveOrder(user: IUser, data: CreateReceiveDto): Promise<Order[]> {
    const orders = await this.orderRepository.find({
      where: { id: In(data.ids), state: IsNull() },
      relations: ['price', 'price.product'],
    });
    const users = await this.usersService.getAllUsers({
      role: Role.Engineer,
    });
    for await (const order of orders) {
      order.state = OrderState.Pending;
      for await (const engineer of users) {
        await this.notificationService.createNotification(user, {
          message: `${order.price.product.name} захиалга хүлээн авлаа`,
          url: `/order/${order.id}`,
          receiverId: engineer.id,
        });
      }
    }
    return await this.orderRepository.save(orders);
  }
  async completeOrder(data: CompleteOrderDto): Promise<void> {
    await this.orderRepository.update(
      { id: In(data.ids) },
      { state: data.state },
    );
  }
  async updateOrders(orders: Order[]): Promise<void> {
    await this.orderRepository.save(orders);
  }

  async createOrderAnalytic(
    user: IUser,
    data: CreateAnalystOrderDto,
  ): Promise<Order> {
    const mineral = await this.mineralService.getMineralById(data.mineralId);
    const order = this.orderRepository.create({
      priceId: data.priceId,
      quantity: 1,
      state: OrderState.Approved,
      receivedBy: user.id,
      createdBy: user.id,
    });
    await this.orderRepository.save(order);
    await this.taskService.createTask(user, {
      mineralId: data.mineralId,
      orderId: order.id,
      isDuplicate: mineral.state == MineralState.analytic,
    });
    return order;
  }
}
