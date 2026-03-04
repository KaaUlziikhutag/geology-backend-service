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
import { LanguageService } from './languages.service';
import { CreateLanguageDto } from './dto/create-languages.dto';
import { UpdateLanguageDto } from './dto/update-languages.dto';
import { GetLanguageDto } from './dto/get-languages.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';

@Controller('human-resource/language')
@UseInterceptors(ClassSerializerInterceptor)
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllLanguages(
    @Req() request: RequestWithUser,
    @Query() query: GetLanguageDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.languageService.getAllLanguages(query, user);
      return new ResponseSuccess('GET_LANGUAGE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getLanguageById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.languageService.getLanguageById(id, user);
      return new ResponseSuccess('GET_LANGUAGE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createLanguage(
    @Req() request: RequestWithUser,
    @Body() language: CreateLanguageDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.languageService.createLanguage(language, user);
      return new ResponseSuccess('CREATE_LANGUAGE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateLanguage(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() language: UpdateLanguageDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.languageService.updateLanguage(
        id,
        user,
        language,
      );
      return new ResponseSuccess('UPDATE_LANGUAGE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteLanguage(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.languageService.deleteLanguage(id, user);
      return new ResponseSuccess('DELETE_LANGUAGE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
