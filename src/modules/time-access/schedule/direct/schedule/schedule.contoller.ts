import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { DirectScheduleService } from './schedule.service';
import { CreateDirectScheduleDto } from './dto/create-schedule.dto';
import { UpdateDirectScheduleDto } from './dto/update-schedule.dto';
import { GetDirectScheduleDto } from './dto/get-schedule.dto';
import FindOneParams from '../../../../../utils/findOneParams';

import { ResponseSuccess } from '../../../../../utils/dto/response.dto';
import { IResponse } from '../../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../../authentication/interface/request-with-user.interface';

@Controller('direct-schedule')
@UseInterceptors(ClassSerializerInterceptor)
export class DirectScheduleController {
  constructor(private readonly directScheduleService: DirectScheduleService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllDirectSchedules(
    @Req() request: RequestWithUser,
    @Query() query: GetDirectScheduleDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.directScheduleService.getAllDirectSchedules(
        query,
        user,
      );
      return new ResponseSuccess('GET_DIRECT_SCHEDULE.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getDirectScheduleById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.directScheduleService.getDirectScheduleById(
        id,
        user,
      );
      return new ResponseSuccess('GET_DIRECT_SCHEDULE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createDirectSchedule(
    @Req() request: RequestWithUser,
    @Body() directSchedule: CreateDirectScheduleDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.directScheduleService.createDirectSchedule(
        directSchedule,
        user,
      );
      return new ResponseSuccess('CREATE_DIRECT_SCHEDULE.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateDirectSchedule(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() directSchedule: UpdateDirectScheduleDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.directScheduleService.updateDirectSchedule(
        id,
        user,
        directSchedule,
      );
      return new ResponseSuccess('UPDATE_DIRECT_SCHEDULE.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteDirectSchedule(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.directScheduleService.deleteDirectSchedule(
        id,
        user,
      );
      return new ResponseSuccess('DELETE_DIRECT_SCHEDULE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
