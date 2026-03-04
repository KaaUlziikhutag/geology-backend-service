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
import { RepeatScheduleService } from './schedule.service';
import { CreateRepeatScheduleDto } from './dto/create-schedule.dto';
import { UpdateRepeatScheduleDto } from './dto/update-schedule.dto';
import { GetRepeatScheduleDto } from './dto/get-schedule.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '@utils/dto/response.dto';
import { IResponse } from '@utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('repeat-schedule')
@UseInterceptors(ClassSerializerInterceptor)
export class RepeatScheduleController {
  constructor(private readonly repeatScheduleService: RepeatScheduleService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllRepeatSchedules(
    @Query() query: GetRepeatScheduleDto,
  ): Promise<IResponse> {
    try {
      const data =
        await this.repeatScheduleService.getAllRepeatSchedules(query);
      return new ResponseSuccess('GET_REPEAT_SCHEDULE.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getRepeatScheduleById(
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const data = await this.repeatScheduleService.getRepeatScheduleById(id);
      return new ResponseSuccess('GET_REPEAT_SCHEDULE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createRepeatSchedule(
    @Body() repeatSchedule: CreateRepeatScheduleDto,
  ): Promise<IResponse> {
    try {
      const data =
        await this.repeatScheduleService.createRepeatSchedule(repeatSchedule);
      return new ResponseSuccess('CREATE_REPEAT_SCHEDULE.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateRepeatSchedule(
    @Param() { id }: FindOneParams,
    @Body() repeatSchedule: UpdateRepeatScheduleDto,
  ): Promise<IResponse> {
    try {
      const data = await this.repeatScheduleService.updateRepeatSchedule(
        id,
        repeatSchedule,
      );
      return new ResponseSuccess('UPDATE_REPEAT_SCHEDULE.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteRepeatSchedule(
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const data = await this.repeatScheduleService.deleteRepeatSchedule(id);
      return new ResponseSuccess('DELETE_REPEAT_SCHEDULE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
