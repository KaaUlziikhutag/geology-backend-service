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
import { AppStageService } from './app-stage.service';
import { CreateAppStageDto } from './dto/create-app-stage.dto';
import { UpdateAppStageDto } from './dto/update-app-stage.dto';
import { GetAppStageDto } from './dto/get-app-stage.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';

@Controller('human-resource/appStage')
@UseInterceptors(ClassSerializerInterceptor)
export class AppStageController {
  constructor(private readonly appStageService: AppStageService) {}

  @Get()
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllAppStages(
    @Req() request: RequestWithUser,
    @Query() query: GetAppStageDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.appStageService.getAllAppStages(query, user);
      return new ResponseSuccess('GET_APP_STAGE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAppStageById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.appStageService.getAppStageById(id, user);
      return new ResponseSuccess('GET_APP_STAGE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createAppStage(
    @Req() request: RequestWithUser,
    @Body() appStage: CreateAppStageDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.appStageService.createAppStage(appStage, user);
      return new ResponseSuccess('CREATE_APP_STAGE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateAppStage(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() appStage: UpdateAppStageDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.appStageService.updateAppStage(
        id,
        user,
        appStage,
      );
      return new ResponseSuccess('UPDATE_APP_STAGE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteAppStage(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.appStageService.deleteAppStage(id, user);
      return new ResponseSuccess('DELETE_APP_STAGE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
