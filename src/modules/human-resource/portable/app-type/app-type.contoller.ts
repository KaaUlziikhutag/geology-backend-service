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
import { AppTypeService } from './app-type.service';
import { CreateAppTypeDto } from './dto/create-app-type.dto';
import { UpdateAppTypeDto } from './dto/update-app-type.dto';
import { GetAppTypeDto } from './dto/get-app-type.dto';
import FindOneParams from '../../../../utils/findOneParams';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('human-resource/appType')
@UseInterceptors(ClassSerializerInterceptor)
export class AppTypeController {
  constructor(private readonly appTypeService: AppTypeService) {}

  @Get()
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllAppTypes(
    @Req() request: RequestWithUser,
    @Query() query: GetAppTypeDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.appTypeService.getAllAppTypes(query, user);
      return new ResponseSuccess('GET_APP_TYPE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAppTypeById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.appTypeService.getAppTypeById(id, user);
      return new ResponseSuccess('GET_APP_TYPE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createAppType(
    @Req() request: RequestWithUser,
    @Body() appType: CreateAppTypeDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.appTypeService.createAppType(appType, user);
      return new ResponseSuccess('CREATE_APP_TYPE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateAppType(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() appType: UpdateAppTypeDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.appTypeService.updateAppType(id, user, appType);
      return new ResponseSuccess('UPDATE_APP_TYPE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteAppType(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.appTypeService.deleteAppType(id, user);
      return new ResponseSuccess('DELETE_APP_TYPE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
