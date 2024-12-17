import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import EmailService from './email.service.js';
import { AuthGuard } from '@nestjs/passport';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard.js';
import { IResponse } from '../../utils/interfaces/response.interface.js';
import { ResponseSuccess } from '../../utils/dto/response.dto.js';
import { SendMailDto } from './dto/send-mail.dto.js';
import { ApiTags } from '@nestjs/swagger';
import RequestWithUser from '../authentication/interface/request-with-user.interface.js';

@Controller('email')
@ApiTags('email')
@UseInterceptors(ClassSerializerInterceptor)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async sendMail(
    @Req() { user }: RequestWithUser,
    @Body() mail: SendMailDto,
  ): Promise<IResponse> {
    try {
      const data = await this.emailService.sendMail(user, mail);
      return new ResponseSuccess('SENT_MAIL', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
}
