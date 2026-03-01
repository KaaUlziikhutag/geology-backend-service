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
import { DelayHumanService } from './delay-human.service';
import { CreateDelayHumanDto } from './dto/create-delay-human.dto';
import { UpdateDelayHumanDto } from './dto/update-delay-human.dto';
import { GetDelayHumanDto } from './dto/get-delay-human.dto';
import FindOneParams from '../../../../utils/findOneParams';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('human-resource/delayHuman')
@UseInterceptors(ClassSerializerInterceptor)
export class DelayHumanController {
  constructor(private readonly delayHumanService: DelayHumanService) {}

  @Get()
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllDelayHumans(
    @Req() request: RequestWithUser,
    @Query() query: GetDelayHumanDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.delayHumanService.getAllDelayHumans(query, user);
      return new ResponseSuccess('GET_DELAY_HUMAN.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getDelayHumanById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.delayHumanService.getDelayHumanById(id, user);
      return new ResponseSuccess('GET_DELAY_HUMAN.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createDelayHuman(
    @Req() request: RequestWithUser,
    @Body() delayHuman: CreateDelayHumanDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.delayHumanService.createDelayHuman(
        delayHuman,
        user,
      );
      return new ResponseSuccess('CREATE_DELAY_HUMAN.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateDelayHuman(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() delayHuman: UpdateDelayHumanDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.delayHumanService.updateDelayHuman(
        id,
        user,
        delayHuman,
      );
      return new ResponseSuccess('UPDATE_DELAY_HUMAN.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteDelayHuman(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.delayHumanService.deleteDelayHuman(id, user);
      return new ResponseSuccess('DELETE_DELAY_HUMAN.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
