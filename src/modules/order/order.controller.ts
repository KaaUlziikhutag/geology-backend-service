import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { IResponse } from '../../utils/interfaces/response.interface';
import { ResponseSuccess } from '../../utils/dto/response.dto';
import FindOneParams from '../../utils/find-one-params';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard';
import CreateOrderDto from './dto/create-order.dto';
import GetOrderDto from './dto/get-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { CompleteOrderDto } from './dto/complete-order.dto';
import RequestWithUser from '../authentication/interface/request-with-user.interface';
import { CreateReceiveDto } from './dto/create-receive.dto';
import { CreateAnalystOrderDto } from './dto/create-analyst-order.dto';

@Controller('order')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createOrder(
    @Req() { user }: RequestWithUser,
    @Body() order: CreateOrderDto,
  ): Promise<IResponse> {
    try {
      const data = await this.orderService.createOrder(user, order);
      return new ResponseSuccess('CREATE_ORDER', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getOrders(
    @Req() { user }: RequestWithUser,
    @Query() query: GetOrderDto,
  ): Promise<IResponse> {
    try {
      const data = await this.orderService.getOrders(user, query);
      return new ResponseSuccess('GET_ORDER', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteOrder(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.orderService.deleteOrder(id);
      return new ResponseSuccess('DELETE_ORDER', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Post('receive')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async receiveOrder(
    @Req() { user }: RequestWithUser,
    @Body() receive: CreateReceiveDto,
  ): Promise<IResponse> {
    try {
      const data = await this.orderService.receiveOrder(user, receive);
      return new ResponseSuccess('RECEIVE_MINERAL.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Post('complete')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async completeOrder(
    @Req() { user }: RequestWithUser,
    @Body() body: CompleteOrderDto,
  ): Promise<IResponse> {
    try {
      const data = await this.orderService.completeOrder(user, body);
      return new ResponseSuccess('COMPLETE_ORDER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  @Post('analytic')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createOrderAnalytic(
    @Req() { user }: RequestWithUser,
    @Body() body: CreateAnalystOrderDto,
  ): Promise<IResponse> {
    try {
      const data = await this.orderService.createOrderAnalytic(user, body);
      return new ResponseSuccess('CREATE_ORDER_ANALYTIC', data);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.toString());
    }
  }
}
