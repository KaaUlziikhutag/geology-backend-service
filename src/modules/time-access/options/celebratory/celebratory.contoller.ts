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
import { CelebratoryService } from './celebratory.service';
import { CreateCelebratoryDto } from './dto/create-celebratory.dto';
import { UpdateCelebratoryDto } from './dto/update-celebratory.dto';
import { GetCelebratoryDto } from './dto/get-celebratory.dto';
import FindOneParams from '../../../../utils/findOneParams';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('time-options-celebratory')
@UseInterceptors(ClassSerializerInterceptor)
export class CelebratoryController {
  constructor(private readonly celebratoryService: CelebratoryService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllCelebratory(
    @Req() request: RequestWithUser,
    @Query() query: GetCelebratoryDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.celebratoryService.getAllCelebratory(query, user);
      return new ResponseSuccess('GET_CELEBRATORY.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getOptionById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.celebratoryService.getCelebratoryById(id, user);
      return new ResponseSuccess('GET_CELEBRATORY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createOption(
    @Req() request: RequestWithUser,
    @Body() celebratory: CreateCelebratoryDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.celebratoryService.createCelebratory(
        celebratory,
        user,
      );
      return new ResponseSuccess('CREATE_CELEBRATORY.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateOption(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() celebratory: UpdateCelebratoryDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.celebratoryService.updateCelebratory(
        id,
        user,
        celebratory,
      );
      return new ResponseSuccess('UPDATE_CELEBRATORY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteOption(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.celebratoryService.deleteCelebratory(id, user);
      return new ResponseSuccess('DELETE_CELEBRATORY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
