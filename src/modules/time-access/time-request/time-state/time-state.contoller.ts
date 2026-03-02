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
import { TimeStateService } from './time-state.service';
import { CreateTimeStateDto } from './dto/create-time-state.dto';
import { UpdateTimeStateDto } from './dto/update-time-state.dto';
import { GetTimeStateDto } from './dto/get-time-state.dto';
import FindOneParams from '../../../../utils/find-one-params';
import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('time-time-state')
@UseInterceptors(ClassSerializerInterceptor)
export class TimeStateController {
  constructor(private readonly timeStateService: TimeStateService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllTimeState(
    @Req() request: RequestWithUser,
    @Query() query: GetTimeStateDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.timeStateService.getAllTimeState(query, user);
      return new ResponseSuccess('GET_TIME_STATE.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getOptionById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.timeStateService.getTimeStateById(id, user);
      return new ResponseSuccess('GET_TIME_STATE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createOption(
    @Req() request: RequestWithUser,
    @Body() timeState: CreateTimeStateDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.timeStateService.createTimeState(timeState, user);
      return new ResponseSuccess('CREATE_TIME_STATE.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateOption(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() timeState: UpdateTimeStateDto,
  ): Promise<IResponse> {
    try {
      const data = await this.timeStateService.updateTimeState(id, timeState);
      return new ResponseSuccess('UPDATE_TIME_STATE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteOption(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.timeStateService.deleteTimeState(id, user);
      return new ResponseSuccess('DELETE_TIME_STATE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
