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
import { AppStageByUserService } from './app-stage-byuser.service';
import { CreateAppStageByUserDto } from './dto/create-app-stage-byuser.dto';
import { UpdateAppStageByUserDto } from './dto/update-app-stage-byuser.dto';
import { GetAppStageByUserDto } from './dto/get-app-stage-byuser.dto';
import FindOneParams from '../../../../utils/findOneParams';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('human-resource/appStageByUser')
@UseInterceptors(ClassSerializerInterceptor)
export class AppStageByUserController {
  constructor(private readonly appStageByUserService: AppStageByUserService) {}

  @Get()
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllAppStageByUsers(
    @Req() request: RequestWithUser,
    @Query() query: GetAppStageByUserDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.appStageByUserService.getAllAppStageByUsers(
        query,
        user,
      );
      return new ResponseSuccess('GET_APP_STAGE_BY_USER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAppStageByUserById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.appStageByUserService.getAppStageByUserById(
        id,
        user,
      );
      return new ResponseSuccess('GET_APP_STAGE_BY_USER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createAppStageByUser(
    @Req() request: RequestWithUser,
    @Body() appStageByUser: CreateAppStageByUserDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.appStageByUserService.createAppStageByUser(
        appStageByUser,
        user,
      );
      return new ResponseSuccess('CREATE_APP_STAGE_BY_USER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateAppStageByUser(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() appStageByUser: UpdateAppStageByUserDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.appStageByUserService.updateAppStageByUser(
        id,
        user,
        appStageByUser,
      );
      return new ResponseSuccess('UPDATE_APP_STAGE_BY_USER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteAppStageByUser(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.appStageByUserService.deleteAppStageByUser(
        id,
        user,
      );
      return new ResponseSuccess('DELETE_APP_STAGE_BY_USER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
