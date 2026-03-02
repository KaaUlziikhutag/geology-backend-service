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
} from '@nestjs/common';
import { DirectScheduleService } from './schedule.service';
import { CreateDirectScheduleDto } from './dto/create-schedule.dto';
import { UpdateDirectScheduleDto } from './dto/update-schedule.dto';
import { GetDirectScheduleDto } from './dto/get-schedule.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '@utils/dto/response.dto';
import { IResponse } from '@utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('direct-schedule')
@UseInterceptors(ClassSerializerInterceptor)
export class DirectScheduleController {
  constructor(private readonly directScheduleService: DirectScheduleService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllDirectSchedules(
    @Query() query: GetDirectScheduleDto,
  ): Promise<IResponse> {
    try {
      const data =
        await this.directScheduleService.getAllDirectSchedules(query);
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
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const data = await this.directScheduleService.getDirectScheduleById(id);
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
    @Body() directSchedule: CreateDirectScheduleDto,
  ): Promise<IResponse> {
    try {
      const data =
        await this.directScheduleService.createDirectSchedule(directSchedule);
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
    @Body() directSchedule: UpdateDirectScheduleDto,
  ): Promise<IResponse> {
    try {
      const data = await this.directScheduleService.updateDirectSchedule(
        id,
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
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const data = await this.directScheduleService.deleteDirectSchedule(id);
      return new ResponseSuccess('DELETE_DIRECT_SCHEDULE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
