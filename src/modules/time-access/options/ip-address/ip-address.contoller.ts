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
import { IpAddressService } from './ip-address.service';
import { CreateIpAddressDto } from './dto/create-ip-address.dto';
import { UpdateIpSettingDto } from './dto/update-ip-address.dto';
import { GetIpAddressDto } from './dto/get-ip-address.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';

@Controller('time-access/options/ip-address')
@UseInterceptors(ClassSerializerInterceptor)
export class IpAddressController {
  constructor(private readonly ipSettingService: IpAddressService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllIpSetting(
    @Req() request: RequestWithUser,
    @Query() query: GetIpAddressDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.ipSettingService.getAllIpSetting(query, user);
      return new ResponseSuccess('GET_IP_SETTINGS.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getIpSettingById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.ipSettingService.getIpSettingById(id, user);
      return new ResponseSuccess('GET_IP_SETTINGS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createIpSetting(
    @Req() request: RequestWithUser,
    @Body() ipSetting: CreateIpAddressDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.ipSettingService.createIpSetting(ipSetting, user);
      return new ResponseSuccess('CREATE_IP_SETTINGS.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateIpSetting(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() ipSetting: UpdateIpSettingDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.ipSettingService.updateIpSetting(
        id,
        user,
        ipSetting,
      );
      return new ResponseSuccess('UPDATE_IP_SETTINGS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteIpSetting(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.ipSettingService.deleteIpSetting(id, user);
      return new ResponseSuccess('DELETE_IP_SETTINGS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
