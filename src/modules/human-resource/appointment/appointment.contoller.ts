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
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { GetAppointmentDto } from './dto/get-appointment.dto';
import FindOneParams from '../../../utils/findOneParams';
import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../authentication/interface/request-with-user.interface';

@Controller('human-resource-appointment')
@UseInterceptors(ClassSerializerInterceptor)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllAppointments(
    @Req() request: RequestWithUser,
    @Query() query: GetAppointmentDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.appointmentService.getAllAppointments(
        query,
        user,
      );
      return new ResponseSuccess('GET_APPOINTMENT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('shift')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllAppointmentShift(
    @Req() request: RequestWithUser,
    @Query() query: GetAppointmentDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.appointmentService.getAllAppointmentShift(
        query,
        user,
      );
      return new ResponseSuccess('GET_APPOINTMENT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAppointmentById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.appointmentService.getAppointmentById(id, user);
      return new ResponseSuccess('GET_APPOINTMENT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createAppointment(
    @Req() request: RequestWithUser,
    @Body() appointment: CreateAppointmentDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.appointmentService.createAppointment(
        appointment,
        user,
      );
      return new ResponseSuccess('CREATE_APPOINTMENT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateAppointment(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() appointment: UpdateAppointmentDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.appointmentService.updateAppointment(
        id,
        user,
        appointment,
      );
      return new ResponseSuccess('UPDATE_APPOINTMENT.SUCCESS', data);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  // Албан томилолт батлах
  @Patch('confirm/:ids')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateAppointmentConfirm(
    @Param('ids') ids: string,
    @Req() request: RequestWithUser,
    @Body() appointment: UpdateAppointmentDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const idArray = ids.split(',').map((id) => {
        const parsedId = Number(id);
        if (isNaN(parsedId)) {
          throw new BadRequestException(`Invalid ID format: ${id}`);
        }
        return parsedId;
      });
      const data = await this.appointmentService.updateAppointmentConfirm(
        idArray,
        user,
        appointment,
      );
      return new ResponseSuccess(
        'UPDATE_HUMAN_RESOURCE_APPOINTMENT.SUCCESS',
        data,
      );
    } catch (error) {
      const err = error as Error;
      throw new BadRequestException(err.message || 'Invalid Request');
    }
  }

  // Албан томилолт шилжүүлэх
  @Patch('transfer/:ids')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateAppointmentTransfer(
    @Param('ids') ids: string,
    @Req() request: RequestWithUser,
    @Body() appointment: UpdateAppointmentDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const idArray = ids.split(',').map((id) => {
        const parsedId = Number(id);
        if (isNaN(parsedId)) {
          throw new BadRequestException(`Invalid ID format: ${id}`);
        }
        return parsedId;
      });
      const data = await this.appointmentService.updateAppointmentTransfer(
        idArray,
        user,
        appointment,
      );
      return new ResponseSuccess(
        'UPDATE_HUMAN_RESOURCE_APPOINTMENT.SUCCESS',
        data,
      );
    } catch (error) {
      const err = error as Error;
      throw new BadRequestException(err.message || 'Invalid Request');
    }
  }

  // Албан томилолт цуцлах
  @Patch('cancelled/:ids')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateAppointmentCancelled(
    @Param('ids') ids: string,
    @Req() request: RequestWithUser,
    @Body() appointment: UpdateAppointmentDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const idArray = ids.split(',').map((id) => {
        const parsedId = Number(id);
        if (isNaN(parsedId)) {
          throw new BadRequestException(`Invalid ID format: ${id}`);
        }
        return parsedId;
      });
      const data = await this.appointmentService.updateAppointmentCancelled(
        idArray,
        user,
        appointment,
      );
      return new ResponseSuccess(
        'UPDATE_HUMAN_RESOURCE_APPOINTMENT.SUCCESS',
        data,
      );
    } catch (error) {
      const err = error as Error;
      throw new BadRequestException(err.message || 'Invalid Request');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteAppointment(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.appointmentService.deleteAppointment(id, user);
      return new ResponseSuccess('DELETE_APPOINTMENT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
