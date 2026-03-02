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
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../authentication/interface/request-with-user.interface';

@Controller('human-resource-access')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthenticationGuard)
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Get()
  @UseGuards(AuthGuard('api-key'))
  async getAllAccesss(@Query() query: GetAccessDto): Promise<IResponse> {
    try {
      const data = await this.accessService.getAllAccesss(query);
      return new ResponseSuccess('GET_ACCESS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('api-key'))
  async getAccessById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.accessService.getAccessById(id);
      return new ResponseSuccess('GET_ACCESS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('worker/:id')
  @UseGuards(AuthGuard('api-key'))
  async getAccessByWorkId(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.accessService.getAccessByWorkId(id);
      return new ResponseSuccess('GET_ACCESS_WORKER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('api-key'))
  async createAccess(@Body() access: CreateAccessDto): Promise<IResponse> {
    try {
      const data = await this.accessService.createAccess(access);
      return new ResponseSuccess('CREATE_ACCESS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard('api-key'))
  async updateAccess(
    @Param() { id }: FindOneParams,
    @Body() access: UpdateAccessDto,
  ): Promise<IResponse> {
    try {
      const data = await this.accessService.updateAccess(id, access);
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
    @Body() access: UpdateAccessDto,
  ): Promise<IResponse> {
    try {
      const data = await this.accessService.updateAccessProgram(id, access);
      return new ResponseSuccess('UPDATE_ACCESS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch('module/:id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateAccessModule(
    @Body() access: UpdateAccessDto,
  ): Promise<IResponse> {
    try {
      const data = await this.accessService.updateAccessModule(access);
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
