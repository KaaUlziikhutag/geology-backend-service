import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service.js';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard.js';
import { AuthGuard } from '@nestjs/passport';
import GetAppointmentDto from './dto/get-appointment.dto.js';
import { IResponse } from '../../utils/interfaces/response.interface.js';
import { ResponseSuccess } from '../../utils/dto/response.dto.js';
import FindOneParams from '../../utils/find-one-params.js';
import { ApiPaginatedResponse } from '../../utils/api-paginated-response.decorator.js';
import CreateAppointmentDto from './dto/create-appointment.dto.js';
import UpdateAppointmentDto from './dto/update-appointment.dto.js';
import { ApiTags } from '@nestjs/swagger';
import RequestWithUser from '../authentication/interface/request-with-user.interface.js';

@Controller('appointment')
@ApiTags('appointment')
@UseInterceptors(ClassSerializerInterceptor)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  @ApiPaginatedResponse(GetAppointmentDto)
  async getAllAppointment(
    @Query() query: GetAppointmentDto,
  ): Promise<IResponse> {
    try {
      const data = await this.appointmentService.getAllAppointment(query);
      return new ResponseSuccess('GET_APPOINTMENT', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAppointmentById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.appointmentService.getAppointmentById(id);
      return new ResponseSuccess('GET_APPOINTMENT', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get(':id/pdf')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async pdfAppointmentById(@Param() { id }: FindOneParams) {
    try {
      const data = await this.appointmentService.pdfAppointmentById(id);
      return data;
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createAppointment(
    @Req() { user }: RequestWithUser,
    @Body() appointment: CreateAppointmentDto,
  ): Promise<IResponse> {
    try {
      const data = await this.appointmentService.createAppointment(
        user,
        appointment,
      );
      return new ResponseSuccess('CREATE_APPOINTMENT', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateAppointment(
    @Param() { id }: FindOneParams,
    @Body() appointment: UpdateAppointmentDto,
  ): Promise<IResponse> {
    try {
      const data = await this.appointmentService.updateAppointment(
        id,
        appointment,
      );
      return new ResponseSuccess('UPDATE_APPOINTMENT', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteAppointment(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.appointmentService.deleteAppointment(id);
      return new ResponseSuccess('DELETE_APPOINTMENT', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
}
