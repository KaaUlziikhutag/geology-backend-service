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
import { MailService } from './mail.service';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import { GetMailDto } from './dto/get-mail.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../authentication/interface/request-with-user.interface';
import { ApiTags } from '@nestjs/swagger';
import CreateUserDto from './users/dto/create-user.dto';

@Controller('mail')
@ApiTags('Е-майл')
@UseInterceptors(ClassSerializerInterceptor)
export class SignatureController {
  constructor(private readonly mailService: MailService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllMail(
    @Req() request: RequestWithUser,
    @Query() query: GetMailDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.mailService.getAllMails(query, user);
      return new ResponseSuccess('GET_MAIL.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getMailById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.mailService.getMailById(id, user);
      return new ResponseSuccess('GET_MAIL.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createMail(
    @Req() request: RequestWithUser,
    @Body() mail: CreateMailDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.mailService.createMail(mail, user);
      return new ResponseSuccess('CREATE_MAIL.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateMail(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() mail: UpdateMailDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.mailService.updateMail(id, user, mail);
      return new ResponseSuccess('UPDATE_MAIL.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch('is-read/:id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateIsReadMail(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() mail: CreateUserDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.mailService.updateIsReadMail(id, user, mail);
      return new ResponseSuccess('UPDATE_MAIL.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteAccess(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.mailService.deleteMail(id, user);
      return new ResponseSuccess('DELETE_MAIL.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
