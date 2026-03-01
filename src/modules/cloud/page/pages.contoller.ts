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

import { PagesService } from './pages.service';
import { CreatePagesDto } from './dto/create-pages.dto';
import { UpdatePagesDto } from './dto/update-pages.dto';
import { GetPagesDto } from './dto/get-pages.dto';
import FindOneParams from '../../../utils/findOneParams';

import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../authentication/interface/request-with-user.interface';

@Controller('cloud/pages')
@UseInterceptors(ClassSerializerInterceptor)
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get()
  @UseGuards(AuthGuard('api-key'))
  async getAllPagess(
    @Req() request: RequestWithUser,
    @Query() query: GetPagesDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.pagesService.getAllPagess(query, user);
      return new ResponseSuccess('GET_PAGES.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getPagesById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.pagesService.getPagesById(id, user);
      return new ResponseSuccess('GET_PAGES.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createPages(
    @Req() request: RequestWithUser,
    @Body() pages: CreatePagesDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.pagesService.createPages(pages, user);
      return new ResponseSuccess('CREATE_PAGES.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updatePages(
    @Param() { id }: FindOneParams,
    @Body() pages: UpdatePagesDto,
    @Req() request: RequestWithUser,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.pagesService.updatePages(id, pages, user);
      return new ResponseSuccess('UPDATE_PAGES.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deletePages(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.pagesService.deletePages(id, user);
      return new ResponseSuccess('DELETE_PAGES.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
