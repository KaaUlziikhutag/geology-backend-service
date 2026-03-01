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
import { DirectService } from './direct.service';
import { CreateDirectDto } from './dto/create-direct.dto';
import { UpdateDirectDto } from './dto/update-direct.dto';
import { GetDirectDto } from './dto/get-direct.dto';
import FindOneParams from '../../../../utils/findOneParams';
import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';
import DirectViewUser from './entities/direct-view-user.entity';

@Controller('time-direct')
@UseInterceptors(ClassSerializerInterceptor)
export class DirectController {
  constructor(private readonly directService: DirectService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllDirect(
    @Req() request: RequestWithUser,
    @Query() query: GetDirectDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.directService.getAllDirect(query, user);
      return new ResponseSuccess('GET_DIRECT.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get('shift')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllDirectShift(
    @Req() request: RequestWithUser,
    @Query() query: GetDirectDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.directService.getAllDirectShift(query, user);
      return new ResponseSuccess('GET_DIRECT.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getDirectById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.directService.getDirectById(id, user);
      return new ResponseSuccess('GET_DIRECT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createDirect(
    @Req() request: RequestWithUser,
    @Body() direct: CreateDirectDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.directService.createDirect(direct, user);
      return new ResponseSuccess('CREATE_DIRECT.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Post('viewUser')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createDirectViewUsers(
    @Req() request: RequestWithUser,
    @Body() direct: DirectViewUser,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.directService.createDirectViewUsers(direct, user);
      return new ResponseSuccess('CREATE_DIRECT.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateDirect(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() direct: UpdateDirectDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.directService.updateDirect(id, user, direct);
      return new ResponseSuccess('UPDATE_DIRECT.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  // Цагийн хуваарь батлах
  @Patch('confirm/:ids')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateDirectConfirm(
    @Param('ids') ids: string,
    @Req() request: RequestWithUser,
    @Body() direct: UpdateDirectDto,
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
      const data = await this.directService.updateDirectConfirm(
        idArray,
        user,
        direct,
      );
      return new ResponseSuccess('UPDATE_DIRECT.SUCCESS', data);
    } catch (error) {
      const err = error as Error;
      throw new BadRequestException(err.message || 'Invalid Request');
    }
  }

  // Цагийн хуваарь шилжүүлэх
  @Patch('transfer/:ids')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateDirectTransfer(
    @Param('ids') ids: string,
    @Req() request: RequestWithUser,
    @Body() direct: UpdateDirectDto,
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
      const data = await this.directService.updateDirectTransfer(
        idArray,
        user,
        direct,
      );
      return new ResponseSuccess('UPDATE_DIRECT.SUCCESS', data);
    } catch (error) {
      const err = error as Error;
      throw new BadRequestException(err.message || 'Invalid Request');
    }
  }

  // Цагийн хуваарь цуцлах
  @Patch('cancelled/:ids')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateDirectCancelled(
    @Param('ids') ids: string,
    @Req() request: RequestWithUser,
    @Body() direct: UpdateDirectDto,
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
      const data = await this.directService.updateDirectCancelled(
        idArray,
        user,
        direct,
      );
      return new ResponseSuccess('UPDATE_DIRECT.SUCCESS', data);
    } catch (error) {
      const err = error as Error;
      throw new BadRequestException(err.message || 'Invalid Request');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteDirect(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.directService.deleteDirect(id, user);
      return new ResponseSuccess('DELETE_DIRECT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
