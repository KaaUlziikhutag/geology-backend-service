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
import { PublicFileService } from './file.service';
import { CreatePublicFileDto } from './dto/create-file.dto';
import { UpdatePublicFileDto } from './dto/update-file.dto';
import { GetPublicFileDto } from './dto/get-file.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';

@Controller('public-file')
@UseInterceptors(ClassSerializerInterceptor)
export class PublicFileController {
  constructor(private readonly publicFileService: PublicFileService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllSignature(@Query() query: GetPublicFileDto): Promise<IResponse> {
    try {
      const data = await this.publicFileService.getAllFiles(query);
      return new ResponseSuccess('GET_FILES.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get('photo-delete')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllFilesDeletePhotos(
    @Query() query: GetPublicFileDto,
  ): Promise<IResponse> {
    try {
      const data = await this.publicFileService.getAllFilesDeletePhotos(query);
      return new ResponseSuccess('DELETE_FILES_PHOTOS.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getFileById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.publicFileService.getFileById(id);
      return new ResponseSuccess('GET_FILE.SUCCESS', data);
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
    @Body() file: CreatePublicFileDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.publicFileService.createFile(file, user);
      return new ResponseSuccess('CREATE_FILE.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateFile(
    @Param() { id }: FindOneParams,
    @Body() file: UpdatePublicFileDto,
  ): Promise<IResponse> {
    try {
      const data = await this.publicFileService.updateFile(id, file);
      return new ResponseSuccess('UPDATE_FILE.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteAccess(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.publicFileService.deleteFile(id);
      return new ResponseSuccess('DELETE_FILE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
