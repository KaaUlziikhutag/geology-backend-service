import {
  Controller,
  Get,
  UseGuards,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { ResponseSuccess } from '../../utils/dto/response.dto';
import { IResponse } from '../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../authentication/interface/request-with-user.interface';
import { GetDashboardDto } from './dto/get-dashboard.dto';
import { DashboardService } from './dashboard.service';

@Controller('human-resource-dashboard')
@UseInterceptors(ClassSerializerInterceptor)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllHumanResourceDashboard(
    @Req() request: RequestWithUser,
    @Query() query: GetDashboardDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.dashboardService.getAllHumanResourceDashboard(
        user,
        query,
      );
      return new ResponseSuccess('GET_DASHBOARD.SUCCESS', data);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  @Get('contract')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllContractDashboard(
    @Req() request: RequestWithUser,
    @Query() query: GetDashboardDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.dashboardService.getAllContractDashboard(
        user,
        query,
      );
      return new ResponseSuccess('GET_DASHBOARD_CONTRACT.SUCCESS', data);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }
}
