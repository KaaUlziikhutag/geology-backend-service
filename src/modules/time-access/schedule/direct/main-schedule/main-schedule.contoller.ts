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
import { MainScheduleService } from './main-schedule.service';
import { CreateMainScheduleDto } from './dto/create-main-schedule.dto';
import { UpdateMainScheduleDto } from './dto/update-main-schedule.dto';
import { GetMainScheduleDto } from './dto/get-main-schedule.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../../../utils/dto/response.dto';
import { IResponse } from '../../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../../authentication/interface/request-with-user.interface';

@Controller('main-schedule')
@UseInterceptors(ClassSerializerInterceptor)
export class MainScheduleController {
  constructor(private readonly mainScheduleService: MainScheduleService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllMainSchedules(
    @Query() query: GetMainScheduleDto,
  ): Promise<IResponse> {
    try {
      const data = await this.mainScheduleService.getAllMainSchedules(query);
      return new ResponseSuccess('GET_MAIN_SCHEDULE.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getMainScheduleById(
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const data = await this.mainScheduleService.getMainScheduleById(id);
      return new ResponseSuccess('GET_MAIN_SCHEDULE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createMainSchedule(
    @Req() request: RequestWithUser,
    @Body() mainSchedule: CreateMainScheduleDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data =
        await this.mainScheduleService.createMainSchedule(mainSchedule);
      return new ResponseSuccess('CREATE_MAIN_SCHEDULE.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateMainSchedule(
    @Param() { id }: FindOneParams,
    @Body() mainSchedule: UpdateMainScheduleDto,
  ): Promise<IResponse> {
    try {
      const data = await this.mainScheduleService.updateMainSchedule(
        id,
        mainSchedule,
      );
      return new ResponseSuccess('UPDATE_MAIN_SCHEDULE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteMainSchedule(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.mainScheduleService.deleteMainSchedule(id);
      return new ResponseSuccess('DELETE_MAIN_SCHEDULE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
