import {
  Controller,
  Get,
  Post,
  Body,
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
  Patch,
} from '@nestjs/common';
import { AgreeByuserService } from './agree-byuser.service';
import { UserIdsDto } from './dto/create-agree-byuser.dto';
import { GetAgreeByuserDto } from './dto/get-agree-byuser.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';
import { UpdateAgreeByuserDto } from './dto/update-agree-byuser.dto';

@Controller('time-access-options-agree-byuser')
@UseInterceptors(ClassSerializerInterceptor)
export class AgreeByuserController {
  constructor(private readonly agreeByuserService: AgreeByuserService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllAgreeByuser(
    @Req() request: RequestWithUser,
    @Query() query: GetAgreeByuserDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.agreeByuserService.getAllAgreeByuser(query, user);
      return new ResponseSuccess('GET_AGREE_BY_USER.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAgreeByuserById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.agreeByuserService.getAgreeByuserById(id, user);
      return new ResponseSuccess('GET_AGREE_BY_USER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createAgreeByuser(
    @Req() request: RequestWithUser,
    @Body() agreeUserIds: UserIdsDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.agreeByuserService.createUsers(
        agreeUserIds,
        user,
      );
      return new ResponseSuccess('CREATE_AGREE_BY_USER.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateAgreeByUser(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() celebratory: UpdateAgreeByuserDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.agreeByuserService.updateAgreeByUser(
        id,
        user,
        celebratory,
      );
      return new ResponseSuccess('UPDATE_AGREE_BY_USER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteAgreeByuser(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.agreeByuserService.deleteAgreeByuser(id, user);
      return new ResponseSuccess('DELETE_AGREE_BY_USER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
