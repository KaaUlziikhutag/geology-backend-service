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
import { AccessService } from './access.service';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import { GetAccessDto } from './dto/get-access.dto';
import FindOneParams from '../../../utils/findOneParams';

import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../authentication/interface/request-with-user.interface';

@Controller('human-resource-access')
@UseInterceptors(ClassSerializerInterceptor)
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllAccesss(
    @Req() request: RequestWithUser,
    @Query() query: GetAccessDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.accessService.getAllAccesss(query, user);
      return new ResponseSuccess('GET_ACCESS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAccessById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.accessService.getAccessById(id, user);
      return new ResponseSuccess('GET_ACCESS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('worker/:id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAccessByWorkId(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.accessService.getAccessByWorkId(id, user);
      return new ResponseSuccess('GET_ACCESS_WORKER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createAccess(
    @Req() request: RequestWithUser,
    @Body() access: CreateAccessDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.accessService.createAccess(access, user);
      return new ResponseSuccess('CREATE_ACCESS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateAccess(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() access: UpdateAccessDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.accessService.updateAccess(id, user, access);
      return new ResponseSuccess('UPDATE_ACCESS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch('worker/:id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateAccessProgram(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() access: UpdateAccessDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.accessService.updateAccessProgram(
        id,
        user,
        access,
      );
      return new ResponseSuccess('UPDATE_ACCESS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch('module/:id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateAccessModule(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() access: UpdateAccessDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.accessService.updateAccessModule(
        id,
        user,
        access,
      );
      return new ResponseSuccess('UPDATE_ACCESS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteAccess(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.accessService.deleteAccess(id, user);
      return new ResponseSuccess('DELETE_ACCESS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
