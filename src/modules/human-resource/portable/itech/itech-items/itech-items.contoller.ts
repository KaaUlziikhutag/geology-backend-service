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
import { ItechItemService } from './itech-items.service';
import { CreateItechItemDto } from './dto/create-itech-items.dto';
import { UpdateItechItemDto } from './dto/update-itech-items.dto';
import { GetItechItemDto } from './dto/get-itech-items.dto';
import FindOneParams from '@utils/find-one-params';
import { ResponseSuccess } from '../../../../../utils/dto/response.dto';
import { IResponse } from '../../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../../authentication/interface/request-with-user.interface';

@Controller('human-resource/itech-items')
@UseInterceptors(ClassSerializerInterceptor)
export class ItechItemController {
  constructor(private readonly itechItemService: ItechItemService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllItechItems(
    @Req() request: RequestWithUser,
    @Query() query: GetItechItemDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.itechItemService.getAllItechItems(query, user);
      return new ResponseSuccess('GET_ITECH.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getItechItemById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.itechItemService.getItechItemById(id, user);
      return new ResponseSuccess('GET_ITECH.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createItechItem(
    @Req() request: RequestWithUser,
    @Body() itechItem: CreateItechItemDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.itechItemService.createItechItem(itechItem, user);
      return new ResponseSuccess('CREATE_ITECH.SUCCESS', data);
    } catch (error) {
      console.log('=====================>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateItechItem(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() itechItem: UpdateItechItemDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.itechItemService.updateItechItem(
        id,
        user,
        itechItem,
      );
      return new ResponseSuccess('UPDATE_ITECH.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteItechItem(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.itechItemService.deleteItechItem(id, user);
      return new ResponseSuccess('DELETE_ITECH.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
