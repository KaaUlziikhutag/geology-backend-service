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
import { TypeService } from './type.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { GetTypeDto } from './dto/get-type.dto';
import FindOneParams from '@utils/find-one-params';
import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';

@Controller('contract-type')
@UseInterceptors(ClassSerializerInterceptor)
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllCategory(
    @Req() request: RequestWithUser,
    @Query() query: GetTypeDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.typeService.getAllTypes(query, user);
      return new ResponseSuccess('GET_TYPES.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getCategoryById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.typeService.getTypeById(id, user);
      return new ResponseSuccess('GET_TYPE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createCategory(
    @Req() request: RequestWithUser,
    @Body() type: CreateTypeDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.typeService.createType(type, user);
      return new ResponseSuccess('CREATE_TYPE.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateAccess(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() type: UpdateTypeDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.typeService.updateType(id, user, type);
      return new ResponseSuccess('UPDATE_TYPE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteAccess(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.typeService.deleteType(id, user);
      return new ResponseSuccess('DELETE_TYPE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
