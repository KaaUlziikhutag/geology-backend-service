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
import { LevelService } from './level.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { GetLevelDto } from './dto/get-level.dto';
import FindOneParams from '../../../../utils/findOneParams';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('human-resource/level')
@UseInterceptors(ClassSerializerInterceptor)
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @Get()
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllLevels(
    @Req() request: RequestWithUser,
    @Query() query: GetLevelDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.levelService.getAllLevels(query, user);
      return new ResponseSuccess('GET_LEVEL.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getLevelById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.levelService.getLevelById(id, user);
      return new ResponseSuccess('GET_LEVEL.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createLevel(
    @Req() request: RequestWithUser,
    @Body() level: CreateLevelDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.levelService.createLevel(level, user);
      return new ResponseSuccess('CREATE_LEVEL.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateLevel(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() level: UpdateLevelDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.levelService.updateLevel(id, user, level);
      return new ResponseSuccess('UPDATE_LEVEL.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteLevel(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.levelService.deleteLevel(id, user);
      return new ResponseSuccess('DELETE_LEVEL.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
