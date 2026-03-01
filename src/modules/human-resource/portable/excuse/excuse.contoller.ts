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
import { ExcuseService } from './excuse.service';
import { CreateExcuseDto } from './dto/create-excuse.dto';
import { UpdateExcuseDto } from './dto/update-excuse.dto';
import { GetExcuseDto } from './dto/get-excuse.dto';
import FindOneParams from '../../../../utils/findOneParams';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('human-resource/excuse')
@UseInterceptors(ClassSerializerInterceptor)
export class ExcuseController {
  constructor(private readonly excuseService: ExcuseService) {}

  @Get()
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllExcuses(
    @Req() request: RequestWithUser,
    @Query() query: GetExcuseDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.excuseService.getAllExcuses(query, user);
      return new ResponseSuccess('GET_EXCUSE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getExcuseById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.excuseService.getExcuseById(id, user);
      return new ResponseSuccess('GET_EXCUSE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createExcuse(
    @Req() request: RequestWithUser,
    @Body() excuse: CreateExcuseDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.excuseService.createExcuse(excuse, user);
      return new ResponseSuccess('CREATE_EXCUSE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateExcuse(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() excuse: UpdateExcuseDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.excuseService.updateExcuse(id, user, excuse);
      return new ResponseSuccess('UPDATE_EXCUSE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteExcuse(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.excuseService.deleteExcuse(id, user);
      return new ResponseSuccess('DELETE_EXCUSE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
