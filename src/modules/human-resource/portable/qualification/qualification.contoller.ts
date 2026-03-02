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
import { QualificationService } from './qualification.service';
import { CreateQualificationDto } from './dto/create-qualification.dto';
import { UpdateQualificationDto } from './dto/update-qualification.dto';
import { GetQualificationDto } from './dto/get-qualification.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('human-resource-qualification')
@UseInterceptors(ClassSerializerInterceptor)
export class QualificationController {
  constructor(private readonly qualificationService: QualificationService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllQualifications(
    @Req() request: RequestWithUser,
    @Query() query: GetQualificationDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.qualificationService.getAllQualifications(
        query,
        user,
      );
      return new ResponseSuccess('GET_Qualification.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getQualificationById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.qualificationService.getQualificationById(
        id,
        user,
      );
      return new ResponseSuccess('GET_Qualification.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createQualification(
    @Req() request: RequestWithUser,
    @Body() qualification: CreateQualificationDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.qualificationService.createQualification(
        qualification,
        user,
      );
      return new ResponseSuccess('CREATE_Qualification.SUCCESS', data);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST, {
        cause: new Error('Some Error'),
      });
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateQualification(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() qualification: UpdateQualificationDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.qualificationService.updateQualification(
        id,
        user,
        qualification,
      );
      return new ResponseSuccess('UPDATE_Qualification.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteQualification(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.qualificationService.deleteQualification(
        id,
        user,
      );
      return new ResponseSuccess('DELETE_Qualification.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
