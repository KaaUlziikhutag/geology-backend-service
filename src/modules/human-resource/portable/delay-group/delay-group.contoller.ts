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
import { DelayGroupService } from './delay-group.service';
import { CreateDelayGroupDto } from './dto/create-delay-group.dto';
import { UpdateDelayGroupDto } from './dto/update-delay-group.dto';
import { GetDelayGroupDto } from './dto/get-delay-group.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';

@Controller('human-resource/delayGroup')
@UseInterceptors(ClassSerializerInterceptor)
export class DelayGroupController {
  constructor(private readonly delayGroupService: DelayGroupService) {}

  @Get()
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllDelayGroups(
    @Req() request: RequestWithUser,
    @Query() query: GetDelayGroupDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.delayGroupService.getAllDelayGroups(query, user);
      return new ResponseSuccess('GET_DELAY_GROUP.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getDelayGroupById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.delayGroupService.getDelayGroupById(id, user);
      return new ResponseSuccess('GET_DELAY_GROUP.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createDelayGroup(
    @Req() request: RequestWithUser,
    @Body() delayGroup: CreateDelayGroupDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.delayGroupService.createDelayGroup(
        delayGroup,
        user,
      );
      return new ResponseSuccess('CREATE_DELAY_GROUP.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateDelayGroup(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() delayGroup: UpdateDelayGroupDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.delayGroupService.updateDelayGroup(
        id,
        user,
        delayGroup,
      );
      return new ResponseSuccess('UPDATE_DELAY_GROUP.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteDelayGroup(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.delayGroupService.deleteDelayGroup(id, user);
      return new ResponseSuccess('DELETE_DELAY_GROUP.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
