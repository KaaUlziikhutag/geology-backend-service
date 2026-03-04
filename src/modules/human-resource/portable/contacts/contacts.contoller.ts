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
import { ContactService } from './contacts.service';
import { CreateContactDto } from './dto/create-contacts.dto';
import { UpdateContactDto } from './dto/update-contacts.dto';
import { GetContactDto } from './dto/get-contacts.dto';
import FindOneParams from '@utils/find-one-params';
import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';

@Controller('human-resource/contact')
@UseInterceptors(ClassSerializerInterceptor)
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllContacts(
    @Req() request: RequestWithUser,
    @Query() query: GetContactDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.contactService.getAllContacts(query, user);
      return new ResponseSuccess('GET_CONTACT.SUCCESS', data);
    } catch (error) {
      console.log('more_contacts_i', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getContactById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.contactService.getContactById(id, user);
      return new ResponseSuccess('GET_CONTACT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createContact(
    @Req() request: RequestWithUser,
    @Body() contact: CreateContactDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.contactService.createContact(contact, user);
      return new ResponseSuccess('CREATE_CONTACT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateContact(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() contact: UpdateContactDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.contactService.updateContact(id, user, contact);
      return new ResponseSuccess('UPDATE_CONTACT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteContact(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.contactService.deleteContact(id, user);
      return new ResponseSuccess('DELETE_CONTACT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
