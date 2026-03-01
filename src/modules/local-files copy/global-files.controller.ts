import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  StreamableFile,
  Res,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UploadedFile,
  Post,
  BadRequestException,
  UseGuards,
  Delete,
} from '@nestjs/common';
import LocalFilesService from './files.service';
import LocalFilesInterceptor from './local-files.interceptor';
import FileUploadDto from '../../utils/dto/fileUpload.dto';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ResponseSuccess } from '../../utils/dto/response.dto';
import { IResponse } from '../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import FindOneParams from '../../utils/findOneParams';

@Controller('global-files')
@UseInterceptors(ClassSerializerInterceptor)
export default class GlobalFilesController {
  constructor(private readonly localFilesService: LocalFilesService) {}

  @Get(':id')
  async getLocalDatabaseFileById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    const file = await this.localFilesService.getGlobalFileById(id);
    const stream = createReadStream(join(process.cwd(), file.path));
    response.set({
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Content-Type': file.mimetype,
    });
    return new StreamableFile(stream);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('fileUpload')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'file',
      path: '/images',
      fileFilter: (request, file, callback) => {
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const allowedDocumentTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (
          !(
            allowedImageTypes.includes(file.mimetype) ||
            allowedDocumentTypes.includes(file.mimetype)
          )
        ) {
          return callback(
            new BadRequestException(
              'Provide a valid image (JPEG, PNG, GIF) or document (PDF, Word)',
            ),
            false,
          );
        }

        callback(null, true);
      },
      limits: {
        fileSize: Math.pow(1024, 2) * 100, // 5MBw vc
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'A new avatar for the user',
    type: FileUploadDto,
  })
  async addFile(@UploadedFile() file: Express.Multer.File): Promise<IResponse> {
    try {
      const data = await this.localFilesService.saveGlobalFileData({
        path: file.path,
        filename: file.originalname,
        mimetype: file.mimetype,
      });
      return new ResponseSuccess('IMAGE_UPLOAD.SUCCESS', data);
    } catch (error) {
      console.log('=====================>', error);
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteBed(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.localFilesService.deleteGlobalFile(id);
      return new ResponseSuccess('DELETE_FILE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
