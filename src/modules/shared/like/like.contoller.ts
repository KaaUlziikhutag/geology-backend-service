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
import { NewsLikeService } from './like.service';
import { CreateNewsLikeDto } from './dto/create-like.dto';
import { UpdateNewsLikeDto } from './dto/update-like.dto';
import { GetNewsLikeDto } from './dto/get-like.dto';
import FindOneParams from '../../../utils/findOneParams';

import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../authentication/interface/request-with-user.interface';

@Controller('public-news-like')
@UseInterceptors(ClassSerializerInterceptor)
export class NewsLikeController {
  constructor(private readonly newsLikeService: NewsLikeService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllNewsLike(
    @Req() request: RequestWithUser,
    @Query() query: GetNewsLikeDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.newsLikeService.getAllNewsLike(query, user);
      return new ResponseSuccess('GET_NEWS_lIKES_SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getNewsLikeById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.newsLikeService.getNewsLikeById(id, user);
      return new ResponseSuccess('GET_NEWS_lIKE_SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createNewsLike(
    @Req() request: RequestWithUser,
    @Body() newsLike: CreateNewsLikeDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.newsLikeService.createNewsLike(newsLike, user);
      return new ResponseSuccess('CREATE_NEWS_lIKE_SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateNewsLike(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() newsLike: UpdateNewsLikeDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.newsLikeService.updateNewsLike(
        id,
        user,
        newsLike,
      );
      return new ResponseSuccess('UPDATE_NEWS_lIKE_SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteNewsLike(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.newsLikeService.deleteNewsLike(id, user);
      return new ResponseSuccess('DELETE_NEWS_lIKE_SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
