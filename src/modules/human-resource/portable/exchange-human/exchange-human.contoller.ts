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
import { ExchangeHumanService } from './exchange-human.service';
import { CreateExchangeHumanDto } from './dto/create-exchange-human.dto';
import { UpdateExchangeHumanDto } from './dto/update-exchange-human.dto';
import { GetExchangeHumanDto } from './dto/get-exchange-human.dto';
import FindOneParams from '../../../../utils/findOneParams';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('human-resource/exchangeHuman')
@UseInterceptors(ClassSerializerInterceptor)
export class ExchangeHumanController {
  constructor(private readonly exchangeHumanService: ExchangeHumanService) {}

  @Get()
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllExchangeHumans(
    @Req() request: RequestWithUser,
    @Query() query: GetExchangeHumanDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.exchangeHumanService.getAllExchangeHumans(
        query,
        user,
      );
      return new ResponseSuccess('GET_EXCHANGE_HUMAN.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getExchangeHumanById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.exchangeHumanService.getExchangeHumanById(
        id,
        user,
      );
      return new ResponseSuccess('GET_EXCHANGE_HUMAN.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createExchangeHuman(
    @Req() request: RequestWithUser,
    @Body() exchangeHuman: CreateExchangeHumanDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.exchangeHumanService.createExchangeHuman(
        exchangeHuman,
        user,
      );
      return new ResponseSuccess('CREATE_EXCHANGE_HUMAN.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateExchangeHuman(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() exchangeHuman: UpdateExchangeHumanDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.exchangeHumanService.updateExchangeHuman(
        id,
        user,
        exchangeHuman,
      );
      return new ResponseSuccess('UPDATE_EXCHANGE_HUMAN.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteExchangeHuman(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.exchangeHumanService.deleteExchangeHuman(
        id,
        user,
      );
      return new ResponseSuccess('DELETE_EXCHANGE_HUMAN.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
