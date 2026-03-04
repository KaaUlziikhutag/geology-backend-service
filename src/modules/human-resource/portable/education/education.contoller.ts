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
  HttpException,
} from '@nestjs/common';
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { GetEducationDto } from './dto/get-education.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';

@Controller('human-resource/education')
@UseInterceptors(ClassSerializerInterceptor)
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllEducations(
    @Req() request: RequestWithUser,
    @Query() query: GetEducationDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.educationService.getAllEducations(query, user);
      return new ResponseSuccess('GET_EDUCATION.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getEducationById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.educationService.getEducationById(id, user);
      return new ResponseSuccess('GET_EDUCATION.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createEducation(
    @Req() request: RequestWithUser,
    @Body() education: CreateEducationDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.educationService.createEducation(education, user);
      return new ResponseSuccess('CREATE_EDUCATION.SUCCESS', data);
    } catch (error) {
      console.log('============>', error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST, {
        cause: new Error('Some Error'),
      });
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateEducation(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() education: UpdateEducationDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.educationService.updateEducation(
        id,
        user,
        education,
      );
      return new ResponseSuccess('UPDATE_EDUCATION.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteEducation(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.educationService.deleteEducation(id, user);
      return new ResponseSuccess('DELETE_EDUCATION.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
