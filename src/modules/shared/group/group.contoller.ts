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
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GetGroupDto } from './dto/get-group.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';

@Controller('settings/group')
@UseInterceptors(ClassSerializerInterceptor)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllGroups(
    @Req() request: RequestWithUser,
    @Query() query: GetGroupDto,
  ): Promise<IResponse> {
    try {
      const data = await this.groupService.getAllGroups(query);
      return new ResponseSuccess('GET_Group.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getGroupById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.groupService.getGroupById(id);
      return new ResponseSuccess('GET_Group.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createGroup(@Body() group: CreateGroupDto): Promise<IResponse> {
    try {
      const data = await this.groupService.createGroup(group);
      return new ResponseSuccess('CREATE_Group.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateGroup(
    @Param() { id }: FindOneParams,
    @Body() group: UpdateGroupDto,
  ): Promise<IResponse> {
    try {
      const data = await this.groupService.updateGroup(id, group);
      return new ResponseSuccess('UPDATE_Group.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteGroup(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.groupService.deleteGroup(id);
      return new ResponseSuccess('DELETE_Group.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
