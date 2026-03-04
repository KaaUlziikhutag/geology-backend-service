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
import { SupervisorService } from './supervisor.service';
import { CreateSupervisorDto } from './dto/create-supervisor.dto';
import { UpdateSupervisorDto } from './dto/update-supervisor.dto';
import { GetSupervisorDto } from './dto/get-supervisor.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';

@Controller('time-access/options/supervisor')
@UseInterceptors(ClassSerializerInterceptor)
export class SupervisorController {
  constructor(private readonly supervisorService: SupervisorService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllSupervisor(
    @Req() request: RequestWithUser,
    @Query() query: GetSupervisorDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.supervisorService.getAllSupervisor(query, user);
      return new ResponseSuccess('GET_SUPERVISOR.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getSupervisorById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.supervisorService.getSupervisorId(id, user);
      return new ResponseSuccess('GET_SUPERVISOR.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createSupervisor(
    @Req() request: RequestWithUser,
    @Body() supervisor: CreateSupervisorDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.supervisorService.createSupervisor(
        supervisor,
        user,
      );
      return new ResponseSuccess('CREATE_SUPERVISOR.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateSupervisor(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() supervisor: UpdateSupervisorDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.supervisorService.updateSupervisor(
        id,
        user,
        supervisor,
      );
      return new ResponseSuccess('UPDATE_SUPERVISOR.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteSupervisor(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.supervisorService.deleteSupervisor(id, user);
      return new ResponseSuccess('DELETE_SUPERVISOR.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
