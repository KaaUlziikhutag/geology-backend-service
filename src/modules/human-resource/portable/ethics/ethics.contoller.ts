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
import { EthicService } from './ethics.service';
import { CreateEthicDto } from './dto/create-ethics.dto';
import { UpdateEthicDto } from './dto/update-ethics.dto';
import { GetEthicDto } from './dto/get-ethics.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('human-resource-ethic')
@UseInterceptors(ClassSerializerInterceptor)
export class EthicController {
  constructor(private readonly ethicService: EthicService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllEthics(
    @Req() request: RequestWithUser,
    @Query() query: GetEthicDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.ethicService.getAllEthics(query, user);
      return new ResponseSuccess('GET_ETHIC.SUCCESS', data);
    } catch (error) {
      console.log('=====>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getEthicById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.ethicService.getEthicById(id, user);
      return new ResponseSuccess('GET_ETHIC.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createEthic(
    @Req() request: RequestWithUser,
    @Body() ethic: CreateEthicDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.ethicService.createEthic(ethic, user);
      return new ResponseSuccess('CREATE_ETHIC.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateEthic(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() ethic: UpdateEthicDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.ethicService.updateEthic(id, user, ethic);
      return new ResponseSuccess('UPDATE_ETHIC.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteEthic(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.ethicService.deleteEthic(id, user);
      return new ResponseSuccess('DELETE_ETHIC.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
