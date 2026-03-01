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
import { AppDeclareService } from './app-declare.service';
import { CreateAppDeclareDto } from './dto/create-app-declare.dto';
import { UpdateAppDeclareDto } from './dto/update-app-declare.dto';
import { GetAppDeclareDto } from './dto/get-app-declare.dto';
import FindOneParams from '../../../../utils/findOneParams';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('human-resource/appDeclare')
@UseInterceptors(ClassSerializerInterceptor)
export class AppDeclareController {
  constructor(private readonly appDeclareService: AppDeclareService) {}

  @Get()
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllAppDeclares(
    @Req() request: RequestWithUser,
    @Query() query: GetAppDeclareDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.appDeclareService.getAllAppDeclares(query, user);
      return new ResponseSuccess('GET_APP_DECLARE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAppDeclareById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.appDeclareService.getAppDeclareById(id, user);
      return new ResponseSuccess('GET_APP_DECLARE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createAppDeclare(
    @Req() request: RequestWithUser,
    @Body() appDeclare: CreateAppDeclareDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.appDeclareService.createAppDeclare(
        appDeclare,
        user,
      );
      return new ResponseSuccess('CREATE_APP_DECLARE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateAppDeclare(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() appDeclare: UpdateAppDeclareDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.appDeclareService.updateAppDeclare(
        id,
        user,
        appDeclare,
      );
      return new ResponseSuccess('UPDATE_APP_DECLARE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteAppDeclare(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.appDeclareService.deleteAppDeclare(id, user);
      return new ResponseSuccess('DELETE_APP_DECLARE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
