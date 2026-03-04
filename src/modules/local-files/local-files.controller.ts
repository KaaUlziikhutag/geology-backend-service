import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  StreamableFile,
  Res,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
  UploadedFile,
  Post,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard';
import LocalFilesService from './local-files.service';
import LocalFilesInterceptor from './local-files.interceptor';
import FileUploadDto from './dto/file-upload.dto';
import type { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ResponseSuccess } from '../../utils/dto/response.dto';
import { IResponse } from '../../utils/interfaces/response.interface';
import { AuthGuard } from '@nestjs/passport';
import FindOneParams from '../../utils/find-one-params';

@Controller('local-files')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('local-files')
export default class LocalFilesController {
  constructor(private readonly localFilesService: LocalFilesService) {}

  @Get(':id')
  async getDatabaseFileById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const file = await this.localFilesService.getFileById(id);
      const stream = createReadStream(join(process.cwd(), file.path));

      response.set({
        'Content-Disposition': `inline; filename="${file.filename}"`,
        'Content-Type': file.mimetype,
      });
      return new StreamableFile(stream);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('fileUpload')
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'file',
      path: '/files',
      limits: {
        fileSize: Math.pow(4096, 2), // 4MB
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'A new avatar for the user',
    type: FileUploadDto,
  })
  async addFile(
    @UploadedFile()
    file: {
      path: string;
      originalname: string;
      mimetype: string;
    },
  ): Promise<IResponse> {
    try {
      const data = await this.localFilesService.saveLocalFileData({
        path: file.path,
        filename: file.originalname,
        mimetype: file.mimetype,
      });
      return new ResponseSuccess('IMAGE_UPLOAD.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteFile(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.localFilesService.deleteFile(id);
      return new ResponseSuccess('DELETE_FILE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
