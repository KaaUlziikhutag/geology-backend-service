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
import { TimeRequestService } from './time-request.service';
import { CreateTimeRequestDto } from './dto/create-time-request.dto';
import { UpdateTimeRequestDto } from './dto/update-time-request.dto';
import { GetTimeRequestDto } from './dto/get-time-request.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '@utils/dto/response.dto';
import { IResponse } from '@utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';

@Controller('time-time-request')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthenticationGuard)
@UseGuards(AuthGuard('api-key'))
export class TimeRequestController {
  constructor(private readonly timeRequestService: TimeRequestService) {}

  @Get()
  async getAllTimeRequest(
    @Query() query: GetTimeRequestDto,
  ): Promise<IResponse> {
    try {
      const data = await this.timeRequestService.getAllTimeRequest(query);
      return new ResponseSuccess('GET_TIME_REQUEST.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getTimeRequestById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.timeRequestService.getTimeRequestById(id, user);
      return new ResponseSuccess('GET_TIME_REQUEST.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTimeRequest(
    @Req() request: RequestWithUser,
    @Body() timeRequest: CreateTimeRequestDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.timeRequestService.createTimeRequest(
        timeRequest,
        user,
      );
      return new ResponseSuccess('CREATE_TIME_REQUEST.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  async updateTimeRequest(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() timeRequest: UpdateTimeRequestDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.timeRequestService.updateTimeRequest(
        id,
        user,
        timeRequest,
      );
      return new ResponseSuccess('UPDATE_TIME_REQUEST.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch('/confirm/:id')
  async updateTimeRequestConfirm(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() timeRequest: UpdateTimeRequestDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.timeRequestService.updateTimeRequestConfirm(
        id,
        user,
        timeRequest,
      );
      return new ResponseSuccess('UPDATE_TIME_REQUEST.SUCCESS', data);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  @Patch('/cancelled/:id')
  async updateTimeRequestCancelled(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() timeRequest: UpdateTimeRequestDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.timeRequestService.updateTimeRequestCancelled(
        id,
        user,
        timeRequest,
      );
      return new ResponseSuccess('UPDATE_TIME_REQUEST.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteTimeRequest(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.timeRequestService.deleteTimeRequest(id);
      return new ResponseSuccess('DELETE_TIME_REQUEST.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
