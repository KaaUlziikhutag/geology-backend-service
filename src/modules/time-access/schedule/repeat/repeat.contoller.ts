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
import { RepeatService } from './repeat.service';
import { CreateRepeatDto } from './dto/create-repeat.dto';
import { UpdateRepeatDto } from './dto/update-repeat.dto';
import { GetRepeatDto } from './dto/get-repeat.dto';
import FindOneParams from '../../../../utils/findOneParams';
import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('time-access-repeat')
@UseInterceptors(ClassSerializerInterceptor)
export class RepeatController {
  constructor(private readonly repeatService: RepeatService) {}
  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllRepeat(
    @Req() request: RequestWithUser,
    @Query() query: GetRepeatDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.repeatService.getAllRepeat(query, user);
      return new ResponseSuccess('GET_REPEAT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // Шилжүүлгийн түүх
  @Get('shift')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getShiftRepeat(
    @Req() request: RequestWithUser,
    @Query() query: GetRepeatDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.repeatService.getShiftRepeat(query, user);
      return new ResponseSuccess('GET_REPEAT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getOptionById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.repeatService.getRepeatById(id, user);
      return new ResponseSuccess('GET_REPEAT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createOption(
    @Req() request: RequestWithUser,
    @Body() Repeat: CreateRepeatDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.repeatService.createRepeat(Repeat, user);
      return new ResponseSuccess('CREATE_REPEAT.SUCCESS', data);
    } catch (error) {
      console.log('error', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateRepeat(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() Repeat: UpdateRepeatDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.repeatService.updateRepeat(id, user, Repeat);
      return new ResponseSuccess('UPDATE_REPEAT.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch('confirm/:ids')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateRepeatConfirm(
    @Param('ids') ids: string,
    @Req() request: RequestWithUser,
    @Body() Repeat: UpdateRepeatDto,
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
      const data = await this.repeatService.updateRepeatConfirm(
        idArray,
        user,
        Repeat,
      );
      return new ResponseSuccess('UPDATE_REPEAT_CONFIRM.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch('cancelled/:ids')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateRepeatCancelled(
    @Param('ids') ids: string,
    @Req() request: RequestWithUser,
    @Body() Repeat: UpdateRepeatDto,
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
      const data = await this.repeatService.updateRepeatCancelled(
        idArray,
        user,
        Repeat,
      );
      return new ResponseSuccess('UPDATE_REPEAT_CANCELLED.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch('transfer/:ids')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateRepeatTransfer(
    @Param('ids') ids: string,
    @Req() request: RequestWithUser,
    @Body() Repeat: UpdateRepeatDto,
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
      const data = await this.repeatService.updateRepeatTransfer(
        idArray,
        user,
        Repeat,
      );
      return new ResponseSuccess('UPDATE_REPEAT_TRANSFER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteOption(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.repeatService.deleteRepeat(id, user);
      return new ResponseSuccess('DELETE_REPEAT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
