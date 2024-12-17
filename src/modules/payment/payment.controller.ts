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
import { AuthGuard } from '@nestjs/passport';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard.js';
import { IResponse } from '../../utils/interfaces/response.interface.js';
import { ResponseSuccess } from '../../utils/dto/response.dto.js';
import FindOneParams from '../../utils/find-one-params.js';
import CreatePaymentDto from './dto/create-payment.dto.js';
import { PaymentService } from './payment.service.js';
import RequestWithUser from '../authentication/interface/request-with-user.interface.js';
import { PaymentDetailService } from './payment-detail/payment-detail.service.js';
import CreatePaymentDetailDto from './payment-detail/dto/create-payment-dtl.dto.js';
import PagePaymentDto from './dto/page-payment.dto.js';
import { ApiTags } from '@nestjs/swagger';
import UpdatePaymentDto from './dto/update-payment.dto.js';
import EbarimtPaymentDto from './dto/ebarimt-payment.dto.js';

@Controller('payment')
@ApiTags('payment')
@UseInterceptors(ClassSerializerInterceptor)
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly paymentdtlService: PaymentDetailService,
  ) {}

  @Post('create')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createPayment(@Body() payment: CreatePaymentDto): Promise<IResponse> {
    try {
      const data = await this.paymentService.createPayment(payment);
      return new ResponseSuccess('CREATE_PAYMENT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }

  @Post('paid')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createPaymentDetail(
    @Body() paymentDtl: CreatePaymentDetailDto,
  ): Promise<IResponse> {
    try {
      const detail =
        await this.paymentdtlService.createPaymentDetail(paymentDtl);
      const data = await this.paymentService.chargePayment(detail.paymentId);
      return new ResponseSuccess('CHARGE_PAYMENT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }

  @Post('ebarimt/:id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async ebarimtPayment(
    @Req() { user }: RequestWithUser,
    @Param() { id }: FindOneParams,
    @Body() payment: EbarimtPaymentDto,
  ): Promise<IResponse> {
    try {
      const data = await this.paymentService.ebarimtPayment(user, id, payment);
      return new ResponseSuccess('EBARIMT_PAYMENT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getPagePayment(@Query() query: PagePaymentDto): Promise<IResponse> {
    try {
      const data = await this.paymentService.getPagePayment(query);
      return new ResponseSuccess('GET_PAYMENT', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getPaymentById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.paymentService.getPaymentById(id);
      return new ResponseSuccess('GET_PAYMENT', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updatePayment(
    @Param() { id }: FindOneParams,
    @Body() payment: UpdatePaymentDto,
  ): Promise<IResponse> {
    try {
      const data = await this.paymentService.updatePayment(id, payment);
      return new ResponseSuccess('UPDATE_PAYMENT.SUCCESS', data);
    } catch (error) {
      console.log('error ========>', error);
      throw new BadRequestException(error.toString());
    }
  }
  @Delete('detail/:id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deletePaymentDetail(
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const data = await this.paymentdtlService.deletePaymentDetail(id);
      return new ResponseSuccess('DELETE_PAYMENT_DETAIL.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async cancelPayment(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.paymentService.cancelPayment(id);
      return new ResponseSuccess('CANCEL_PAYMENT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
}
