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
import { SocialsService } from './socials.service';
import { CreateSocialsDto } from './dto/create-socials.dto';
import { UpdateSocialsDto } from './dto/update-socials.dto';
import { GetSocialsDto } from './dto/get-socials.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';

@Controller('human-resource-social')
@UseInterceptors(ClassSerializerInterceptor)
export class SocialsController {
  constructor(private readonly socialsService: SocialsService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllSocialss(
    @Req() request: RequestWithUser,
    @Query() query: GetSocialsDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.socialsService.getAllSocialss(query, user);
      return new ResponseSuccess('GET_SOCIALS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getSocialsById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.socialsService.getSocialsById(id, user);
      return new ResponseSuccess('GET_SOCIALS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createSocials(
    @Req() request: RequestWithUser,
    @Body() socials: CreateSocialsDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.socialsService.createSocials(socials, user);
      return new ResponseSuccess('CREATE_SOCIALS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateSocials(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() socials: UpdateSocialsDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.socialsService.updateSocials(id, user, socials);
      return new ResponseSuccess('UPDATE_SOCIALS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteSocials(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.socialsService.deleteSocials(id, user);
      return new ResponseSuccess('DELETE_SOCIALS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
