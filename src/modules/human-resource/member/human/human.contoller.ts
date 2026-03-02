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
import { HumanService } from './human.service';
import { CreateHumanDto } from './dto/create-human.dto';
import { UpdateHumanDto } from './dto/update-human.dto';
import { GetHumanDto } from './dto/get-human.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('human')
@UseInterceptors(ClassSerializerInterceptor)
export class HumanController {
  constructor(private readonly humanService: HumanService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllHumans(
    @Req() request: RequestWithUser,
    @Query() query: GetHumanDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.humanService.getAllHumans(user, query);
      return new ResponseSuccess('GET_HUMAN.SUCCESS', data);
    } catch (error) {
      console.log('----------------------------->', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getHumanById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.humanService.getHumanById(user, id);
      return new ResponseSuccess('GET_HUMAN.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createHuman(
    @Req() request: RequestWithUser,
    @Body() human: CreateHumanDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.humanService.createHuman(user, human);
      return new ResponseSuccess('CREATE_HUMAN.SUCCESS', data);
    } catch (error) {
      console.log('----------------------------->', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateHuman(
    @Param() { id }: FindOneParams,
    @Body() human: UpdateHumanDto,
    @Req() request: RequestWithUser,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.humanService.updateHuman(id, user, human);
      return new ResponseSuccess('UPDATE_HUMAN.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteHuman(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.humanService.deleteHuman(user, id);
      return new ResponseSuccess('DELETE_HUMAN.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
