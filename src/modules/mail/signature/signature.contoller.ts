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
import { SignatureService } from './signature.service';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { UpdateSignatureDto } from './dto/update-signature.dto';
import { GetSignatureDto } from './dto/get-signature.dto';
import FindOneParams from '../../../utils/findOneParams';

import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../authentication/interface/request-with-user.interface';
import { UpdateSignatureViewUserDto } from './view-users/dto/update-signature.dto';

@Controller('mail-signature')
@UseInterceptors(ClassSerializerInterceptor)
export class SignatureController {
  constructor(private readonly signatureService: SignatureService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllSignature(
    @Req() request: RequestWithUser,
    @Query() query: GetSignatureDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.signatureService.getAllSystemMails(query, user);
      return new ResponseSuccess('GET_CONTRACTS.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getSignatureById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.signatureService.getSignatureById(id, user);
      return new ResponseSuccess('GET_CONTRACT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createSignature(
    @Req() request: RequestWithUser,
    @Body() mail: CreateSignatureDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.signatureService.createSignature(mail, user);
      return new ResponseSuccess('CREATE_CONTRACT.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateSystemMail(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() signature: UpdateSignatureDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.signatureService.updateSignature(
        id,
        user,
        signature,
      );
      return new ResponseSuccess('UPDATE_CONTRACT.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch('active/:id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateSignatureVewUser(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() signature: UpdateSignatureViewUserDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.signatureService.updateSignatureVewUser(
        id,
        user,
        signature,
      );
      return new ResponseSuccess('UPDATE_SIGNATURE_VIEW_USER_.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
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
      const data = await this.signatureService.deleteSignature(id, user);
      return new ResponseSuccess('DELETE_CONTRACT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
