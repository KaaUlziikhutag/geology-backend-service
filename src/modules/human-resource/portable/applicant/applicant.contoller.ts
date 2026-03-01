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
import { ApplicantService } from './applicant.service';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { UpdateApplicantDto } from './dto/update-applicant.dto';
import { GetApplicantDto } from './dto/get-applicant.dto';
import FindOneParams from '../../../../utils/findOneParams';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('human-resource/applicant')
@UseInterceptors(ClassSerializerInterceptor)
export class ApplicantController {
  constructor(private readonly applicantService: ApplicantService) {}

  @Get()
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllApplicants(
    @Req() request: RequestWithUser,
    @Query() query: GetApplicantDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.applicantService.getAllApplicants(query, user);
      return new ResponseSuccess('GET_APPLICANT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getApplicantById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.applicantService.getApplicantById(id, user);
      return new ResponseSuccess('GET_APPLICANT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createApplicant(
    @Req() request: RequestWithUser,
    @Body() applicant: CreateApplicantDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.applicantService.createApplicant(applicant, user);
      return new ResponseSuccess('CREATE_APPLICANT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateApplicant(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() applicant: UpdateApplicantDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.applicantService.updateApplicant(
        id,
        user,
        applicant,
      );
      return new ResponseSuccess('UPDATE_APPLICANT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteApplicant(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.applicantService.deleteApplicant(id, user);
      return new ResponseSuccess('DELETE_APPLICANT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
