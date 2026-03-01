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
  Req,
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
import RequestWithUser from '../authentication/interface/request-with-user.interface';

@Controller('local-files')
@UseInterceptors(ClassSerializerInterceptor)
export default class LocalFilesController {
  constructor(private readonly localFilesService: LocalFilesService) {}

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getLocalDatabaseFileById(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user } = request;
    const file = await this.localFilesService.getFileById(user, id);
    const stream = createReadStream(join(process.cwd(), file.path));
    const encodedFilename = encodeURIComponent(file.filename);
    response.set({
      'Content-Disposition': `inline; filename="${encodedFilename}"`,
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
      path: '/uploads', // Consider renaming path to a more general directory
      limits: {
        fileSize: Math.pow(1024, 2) * 100, // 100MB
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload any file',
    type: FileUploadDto,
  })
  async addFile(
    @Req() request: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const filename = file.originalname;
      const encodedFilename = encodeURIComponent(filename);
      const data = await this.localFilesService.saveLocalFileData(user, {
        path: file.path,
        filename: encodedFilename,
        mimetype: file.mimetype,
      });
      return new ResponseSuccess('FILE_UPLOAD.SUCCESS', data);
    } catch (error) {
      console.log('=====================>', error);
      throw new BadRequestException(error);
    }
  }

  // @HttpCode(HttpStatus.CREATED)
  // @Post('fileUpload')
  // @UseGuards(JwtAuthenticationGuard)
  // @UseGuards(AuthGuard('api-key'))
  // @UseInterceptors(
  //   LocalFilesInterceptor({
  //     fieldName: 'file',
  //     path: '/images',
  //     fileFilter: (request, file, callback) => {
  //       const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
  //       const allowedDocumentTypes = [
  //         'application/pdf',
  //         'application/msword',
  //         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //       ];

  //       if (
  //         !(
  //           allowedImageTypes.includes(file.mimetype) ||
  //           allowedDocumentTypes.includes(file.mimetype)
  //         )
  //       ) {
  //         return callback(
  //           new BadRequestException(
  //             'Provide a valid image (JPEG, PNG, GIF) or document (PDF, Word)',
  //           ),
  //           false,
  //         );
  //       }

  //       callback(null, true);
  //     },
  //     limits: {
  //       fileSize: Math.pow(1024, 2) * 100, // 5MBw vc
  //     },
  //   }),
  // )
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   description: 'A new avatar for the user',
  //   type: FileUploadDto,
  // })
  // async addFile(
  //   @Req() request: RequestWithUser,
  //   @UploadedFile() file: Express.Multer.File,
  // ): Promise<IResponse> {
  //   try {
  //     const { user } = request;
  //     const data = await this.localFilesService.saveLocalFileData(user, {
  //       path: file.path,
  //       filename: file.originalname,
  //       mimetype: file.mimetype,
  //     });
  //     return new ResponseSuccess('IMAGE_UPLOAD.SUCCESS', data);
  //   } catch (error) {
  //     console.log('=====================>', error);
  //     throw new BadRequestException(error);
  //   }
  // }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteBed(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.localFilesService.deleteFile(user, id);
      return new ResponseSuccess('DELETE_FILE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
