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
import { AwardService } from './awards.service';
import { CreateAwardDto } from './dto/create-awards.dto';
import { UpdateAwardDto } from './dto/update-awards.dto';
import { GetAwardDto } from './dto/get-awards.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('human-resource/award')
@UseInterceptors(ClassSerializerInterceptor)
export class AwardController {
  constructor(private readonly awardService: AwardService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllAwards(
    @Req() request: RequestWithUser,
    @Query() query: GetAwardDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.awardService.getAllAwards(query, user);
      return new ResponseSuccess('GET_AWARDS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAwardById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.awardService.getAwardById(id, user);
      return new ResponseSuccess('GET_AWARDS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createAward(
    @Req() request: RequestWithUser,
    @Body() award: CreateAwardDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.awardService.createAward(award, user);
      return new ResponseSuccess('CREATE_AWARDS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateAward(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() award: UpdateAwardDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.awardService.updateAward(id, user, award);
      return new ResponseSuccess('UPDATE_AWARDS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteAward(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.awardService.deleteAward(id, user);
      return new ResponseSuccess('DELETE_AWARDS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
