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
import { SystemMailService } from './system-mail.service';
import { CreateSystemMailDto } from './dto/create-system-mail.dto';
import { UpdateSystemMailDto } from './dto/update-system-mail.dto';
import { GetSystemMailDto } from './dto/get-system-mail.dto';
import FindOneParams from '../../../utils/findOneParams';

import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../authentication/interface/request-with-user.interface';

@Controller('mail-system')
@UseInterceptors(ClassSerializerInterceptor)
export class SystemMailController {
  constructor(private readonly systemMailService: SystemMailService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllSystemMails(
    @Req() request: RequestWithUser,
    @Query() query: GetSystemMailDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.systemMailService.getAllSystemMails(query, user);
      return new ResponseSuccess('GET_CONTRACTS.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getSystemMailById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.systemMailService.getSystemMailById(id, user);
      return new ResponseSuccess('GET_CONTRACT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createSystemMail(
    @Req() request: RequestWithUser,
    @Body() systemMail: CreateSystemMailDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.systemMailService.createSystemMail(
        systemMail,
        user,
      );
      return new ResponseSuccess('CREATE_CONTRACT.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateSystemMail(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() systemMail: UpdateSystemMailDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.systemMailService.updateSystemMail(
        id,
        user,
        systemMail,
      );
      return new ResponseSuccess('UPDATE_CONTRACT.SUCCESS', data);
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
      const data = await this.systemMailService.deleteSystemMail(id, user);
      return new ResponseSuccess('DELETE_CONTRACT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
