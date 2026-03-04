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
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { GetExperienceDto } from './dto/get-experience.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';

@Controller('human-resource/experience')
@UseInterceptors(ClassSerializerInterceptor)
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllExperiences(
    @Req() request: RequestWithUser,
    @Query() query: GetExperienceDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.experienceService.getAllExperiences(query, user);
      return new ResponseSuccess('GET_EXPERIENCE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getExperienceById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.experienceService.getExperienceById(id, user);
      return new ResponseSuccess('GET_EXPERIENCE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createExperience(
    @Req() request: RequestWithUser,
    @Body() experience: CreateExperienceDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.experienceService.createExperience(
        experience,
        user,
      );
      return new ResponseSuccess('CREATE_EXPERIENCE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateExperience(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() experience: UpdateExperienceDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.experienceService.updateExperience(
        id,
        user,
        experience,
      );
      return new ResponseSuccess('UPDATE_EXPERIENCE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteExperience(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.experienceService.deleteExperience(id, user);
      return new ResponseSuccess('DELETE_EXPERIENCE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
