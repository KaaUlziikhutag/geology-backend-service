import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service.js';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard.js';
import { AuthGuard } from '@nestjs/passport';
import { GetCustomerDto } from './dto/get-dashboard.dto.js';
import { IResponse } from '../../utils/interfaces/response.interface.js';
import { ResponseSuccess } from '../../utils/dto/response.dto.js';

@Controller('dashboard')
@ApiTags('dashboard')
@UseInterceptors(ClassSerializerInterceptor)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('count-customer')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getCountCustomer(@Query() query: GetCustomerDto): Promise<IResponse> {
    try {
      const data = await this.dashboardService.getCountCustomer(query);
      return new ResponseSuccess('GET_COUNT_CUSTOMER', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get('count-mineral')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getCountMineral(): Promise<IResponse> {
    try {
      const data = await this.dashboardService.getCountMineral();
      return new ResponseSuccess('GET_COUNT_MINERAL', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get('count-appointment')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getCountAppointment(): Promise<IResponse> {
    try {
      const data = await this.dashboardService.getCountAppointment();
      return new ResponseSuccess('GET_COUNT_APPOINTMENT', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
}
