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
import { ItechService } from './itech.service';
import { CreateItechDto } from './dto/create-itech.dto';
import { UpdateItechDto } from './dto/update-itech.dto';
import { GetItechDto } from './dto/get-itech.dto';
import FindOneParams from '../../../../utils/findOneParams';
import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('human-resource-itech')
@UseInterceptors(ClassSerializerInterceptor)
export class ItechController {
  constructor(private readonly itechService: ItechService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllItechs(
    @Req() request: RequestWithUser,
    @Query() query: GetItechDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.itechService.getAllItechs(query, user);
      return new ResponseSuccess('GET_ITECH.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getItechById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.itechService.getItechById(id, user);
      return new ResponseSuccess('GET_ITECH.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createItech(
    @Req() request: RequestWithUser,
    @Body() itech: CreateItechDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.itechService.createItech(itech, user);
      return new ResponseSuccess('CREATE_ITECH.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateItech(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() itech: UpdateItechDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.itechService.updateItech(id, user, itech);
      return new ResponseSuccess('UPDATE_ITECH.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteItech(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.itechService.deleteItech(id, user);
      return new ResponseSuccess('DELETE_ITECH.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
