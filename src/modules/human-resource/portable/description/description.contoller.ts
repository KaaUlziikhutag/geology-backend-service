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
import { DescriptionService } from './description.service';
import { CreateDescriptionDto } from './dto/create-description.dto';
import { UpdateDescriptionDto } from './dto/update-description.dto';
import { GetDescriptionDto } from './dto/get-description.dto';
import FindOneParams from '../../../../utils/findOneParams';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('human-resource-description')
@UseInterceptors(ClassSerializerInterceptor)
export class DescriptionController {
  constructor(private readonly descriptionService: DescriptionService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllDescriptions(
    @Req() request: RequestWithUser,
    @Query() query: GetDescriptionDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.descriptionService.getAllDescriptions(
        query,
        user,
      );
      return new ResponseSuccess('GET_DESCRIPTION.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getDescriptionById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.descriptionService.getDescriptionById(id, user);
      return new ResponseSuccess('GET_DESCRIPTION.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createDescription(
    @Req() request: RequestWithUser,
    @Body() description: CreateDescriptionDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.descriptionService.createDescription(
        description,
        user,
      );
      return new ResponseSuccess('CREATE_DESCRIPTION.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateDescription(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() description: UpdateDescriptionDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.descriptionService.updateDescription(
        id,
        user,
        description,
      );
      return new ResponseSuccess('UPDATE_DESCRIPTION.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteDescription(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.descriptionService.deleteDescription(id, user);
      return new ResponseSuccess('DELETE_DESCRIPTION.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
