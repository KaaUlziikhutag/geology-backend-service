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
import { OthersService } from './others.service';
import { CreateOthersDto } from './dto/create-others.dto';
import { UpdateOthersDto } from './dto/update-others.dto';
import { GetOthersDto } from './dto/get-others.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';

@Controller('human-resource-others')
@UseInterceptors(ClassSerializerInterceptor)
export class OthersController {
  constructor(private readonly othersService: OthersService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllOtherss(
    @Req() request: RequestWithUser,
    @Query() query: GetOthersDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.othersService.getAllOtherss(query, user);
      return new ResponseSuccess('GET_OTHERS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getOthersById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.othersService.getOthersById(id, user);
      return new ResponseSuccess('GET_OTHERS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createOthers(
    @Req() request: RequestWithUser,
    @Body() Others: CreateOthersDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.othersService.createOthers(Others, user);
      return new ResponseSuccess('CREATE_OTHERS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateOthers(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() Others: UpdateOthersDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.othersService.updateOthers(id, user, Others);
      return new ResponseSuccess('UPDATE_OTHERS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteOthers(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.othersService.deleteOthers(id, user);
      return new ResponseSuccess('DELETE_OTHERS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
