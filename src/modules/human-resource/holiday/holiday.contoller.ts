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
import { HolidayService } from './holiday.service';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { GetHolidayDto } from './dto/get-holiday.dto';
import FindOneParams from '@utils/find-one-params';
import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';

@Controller('human-resource-holiday')
@UseInterceptors(ClassSerializerInterceptor)
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllHolidays(
    @Req() request: RequestWithUser,
    @Query() query: GetHolidayDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.holidayService.getAllHolidays(query, user);
      return new ResponseSuccess('GET_HOLIDAY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('shift')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllShift(
    @Req() request: RequestWithUser,
    @Query() query: GetHolidayDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.holidayService.getAllShift(query, user);
      return new ResponseSuccess('GET_HOLIDAY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getHolidayById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.holidayService.getHolidayById(id, user);
      return new ResponseSuccess('GET_HOLIDAY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createHoliday(
    @Req() request: RequestWithUser,
    @Body() holiday: CreateHolidayDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.holidayService.createHoliday(holiday, user);
      return new ResponseSuccess('CREATE_HOLIDAY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateHoliday(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() holiday: UpdateHolidayDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.holidayService.updateHoliday(id, user, holiday);
      return new ResponseSuccess('UPDATE_HOLIDAY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // Ээлжийн амралт батлах
  @Patch('confirm/:ids')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateHolidayConfirm(
    @Param('ids') ids: string,
    @Req() request: RequestWithUser,
    @Body() holiday: UpdateHolidayDto,
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
      const data = await this.holidayService.updateHolidayConfirm(
        idArray,
        user,
        holiday,
      );
      return new ResponseSuccess('UPDATE_HUMAN_RESOURCE_HOLIDAY.SUCCESS', data);
    } catch (error) {
      const err = error as Error;
      throw new BadRequestException(err.message || 'Invalid Request');
    }
  }

  // Ээлжийн амралт шилжүүлэх
  @Patch('transfer/:ids')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateHolidayTransfer(
    @Param('ids') ids: string,
    @Req() request: RequestWithUser,
    @Body() holiday: UpdateHolidayDto,
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
      const data = await this.holidayService.updateHolidayTransfer(
        idArray,
        user,
        holiday,
      );
      return new ResponseSuccess('UPDATE_HUMAN_RESOURCE_HOLIDAY.SUCCESS', data);
    } catch (error) {
      const err = error as Error;
      throw new BadRequestException(err.message || 'Invalid Request');
    }
  }

  // Ээлжийн амралт цуцлах
  @Patch('cancelled/:ids')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateHolidayCancelled(
    @Param('ids') ids: string,
    @Req() request: RequestWithUser,
    @Body() holiday: UpdateHolidayDto,
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
      const data = await this.holidayService.updateHolidayCancelled(
        idArray,
        user,
        holiday,
      );
      return new ResponseSuccess('UPDATE_HUMAN_RESOURCE_HOLIDAY.SUCCESS', data);
    } catch (error) {
      const err = error as Error;
      throw new BadRequestException(err.message || 'Invalid Request');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteHoliday(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.holidayService.deleteHoliday(id, user);
      return new ResponseSuccess('DELETE_HOLIDAY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
