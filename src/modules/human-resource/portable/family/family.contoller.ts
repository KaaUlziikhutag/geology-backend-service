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
import { FamilyService } from './family.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family-human.dto';
import { GetFamilyDto } from './dto/get-family.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';

@Controller('human-resource-family')
@UseInterceptors(ClassSerializerInterceptor)
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllFamilys(
    @Req() request: RequestWithUser,
    @Query() query: GetFamilyDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.familyService.getAllFamilys(query, user);
      return new ResponseSuccess('GET_FAMILY.SUCCESS', data);
    } catch (error) {
      console.log('error =>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getFamilyById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.familyService.getFamilyById(id, user);
      return new ResponseSuccess('GET_FAMILY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createFamily(
    @Req() request: RequestWithUser,
    @Body() family: CreateFamilyDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.familyService.createFamily(family, user);
      return new ResponseSuccess('CREATE_FAMILY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateFamily(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() family: UpdateFamilyDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.familyService.updateFamily(id, user, family);
      return new ResponseSuccess('UPDATE_FAMILY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteFamily(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.familyService.deleteFamily(id, user);
      return new ResponseSuccess('DELETE_FAMILY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
