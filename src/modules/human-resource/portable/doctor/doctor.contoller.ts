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
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { GetDoctorDto } from './dto/get-doctor.dto';
import FindOneParams from '../../../../utils/findOneParams';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('human-resource-doctor')
@UseInterceptors(ClassSerializerInterceptor)
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllDoctors(
    @Req() request: RequestWithUser,
    @Query() query: GetDoctorDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.doctorService.getAllDoctors(query, user);
      return new ResponseSuccess('GET_DOCTORS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getDoctorById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.doctorService.getDoctorById(id, user);
      return new ResponseSuccess('GET_DOCTORS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createDoctor(
    @Req() request: RequestWithUser,
    @Body() doctor: CreateDoctorDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.doctorService.createDoctor(doctor, user);
      return new ResponseSuccess('CREATE_DOCTORS.SUCCESS', data);
    } catch (error) {
      console.log('aldaa -++++++++++++++++++++++++++++>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateDoctor(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() doctor: UpdateDoctorDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.doctorService.updateDoctor(id, user, doctor);
      return new ResponseSuccess('UPDATE_DOCTORS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteDoctor(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.doctorService.deleteDoctor(id, user);
      return new ResponseSuccess('DELETE_DOCTORS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
