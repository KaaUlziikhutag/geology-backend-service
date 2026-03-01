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
import { InnerService } from './inner.service';
import { CreateInnerDto } from './dto/create-inner.dto';
import { UpdateInnerDto } from './dto/update-inner.dto';
import { GetInnerDto } from './dto/get-inner.dto';
import FindOneParams from '../../../utils/findOneParams';

import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../authentication/interface/request-with-user.interface';

@Controller('decision-inner')
@UseInterceptors(ClassSerializerInterceptor)
export class InnerController {
  constructor(private readonly innerService: InnerService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllInner(
    @Req() request: RequestWithUser,
    @Query() query: GetInnerDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.innerService.getAllInners(query, user);
      return new ResponseSuccess('GET_INNERS.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getInnerById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.innerService.getInnerById(id, user);
      return new ResponseSuccess('GET_INNER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createInner(
    @Req() request: RequestWithUser,
    @Body() inner: CreateInnerDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.innerService.createInner(inner, user);
      return new ResponseSuccess('CREATE_INNER.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateInner(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() inner: UpdateInnerDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.innerService.updateInner(id, user, inner);
      return new ResponseSuccess('UPDATE_INNER.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteInner(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.innerService.deleteInner(id, user);
      return new ResponseSuccess('DELETE_INNER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
