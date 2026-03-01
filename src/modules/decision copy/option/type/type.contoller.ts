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
import { DecisionTypeService } from './type.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { GetTypeDto } from './dto/get-type.dto';
import FindOneParams from '../../../../utils/findOneParams';
import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('decision-type')
@UseInterceptors(ClassSerializerInterceptor)
export class DecisionTypeController {
  constructor(private readonly typeService: DecisionTypeService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllType(
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
  async getTypeById(
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
  async createType(
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
