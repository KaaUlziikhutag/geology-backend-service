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
import { PublicGalleryService } from './gallery.service';
import { CreatePublicGalleryDto } from './dto/create-gallery.dto';
import { UpdatePublicGalleryDto } from './dto/update-gallery.dto';
import { GetPublicGalleryDto } from './dto/get-gallery.dto';
import FindOneParams from '../../../utils/findOneParams';

import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../authentication/interface/request-with-user.interface';

@Controller('public-gallery')
@UseInterceptors(ClassSerializerInterceptor)
export class PublicGalleryController {
  constructor(private readonly publicGalleryService: PublicGalleryService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllSignature(
    @Req() request: RequestWithUser,
    @Query() query: GetPublicGalleryDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.publicGalleryService.getAllGallery(query, user);
      return new ResponseSuccess('GET_GALLERIES.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getGalleryById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.publicGalleryService.getGalleryById(id, user);
      return new ResponseSuccess('GET_GALLERY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createFile(
    @Req() request: RequestWithUser,
    @Body() gallery: CreatePublicGalleryDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.publicGalleryService.createGallery(gallery, user);
      return new ResponseSuccess('CREATE_GALLERY.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateGallery(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() gallery: UpdatePublicGalleryDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.publicGalleryService.updateFile(
        id,
        user,
        gallery,
      );
      return new ResponseSuccess('UPDATE_GALLERY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteGallery(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.publicGalleryService.deleteGallery(id, user);
      return new ResponseSuccess('DELETE_GALLERY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
