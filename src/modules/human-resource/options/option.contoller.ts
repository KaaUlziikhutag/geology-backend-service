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
import { OptionService } from './option.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { GetOptionDto } from './dto/get-option.dto';
import FindOneParams from '../../../utils/findOneParams';
import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../authentication/interface/request-with-user.interface';

@Controller('human-resource-option')
@UseInterceptors(ClassSerializerInterceptor)
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Get()
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllOptions(
    @Req() request: RequestWithUser,
    @Query() query: GetOptionDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.optionService.getAllOptions(query, user);
      return new ResponseSuccess('GET_OPTION.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getOptionById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.optionService.getOptionById(id, user);
      return new ResponseSuccess('GET_OPTION.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createOption(
    @Req() request: RequestWithUser,
    @Body() option: CreateOptionDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.optionService.createOption(option, user);
      return new ResponseSuccess('CREATE_OPTION.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateOption(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() option: UpdateOptionDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.optionService.updateOption(id, user, option);
      return new ResponseSuccess('UPDATE_OPTION.SUCCESS', data);
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
      const data = await this.optionService.deleteOption(id, user);
      return new ResponseSuccess('DELETE_OPTION.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
