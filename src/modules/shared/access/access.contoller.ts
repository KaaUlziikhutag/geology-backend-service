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
import { SharedAccessService } from './access.service';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import { GetAccessDto } from './dto/get-access.dto';
import FindOneParams from '@utils/find-one-params';
import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('shared-access')
@UseInterceptors(ClassSerializerInterceptor)
export class SharedAccessController {
  constructor(private readonly sharedAccessService: SharedAccessService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllAccesss(@Query() query: GetAccessDto): Promise<IResponse> {
    try {
      const data = await this.sharedAccessService.getAllAccesss(query);
      return new ResponseSuccess('GET_ACCESS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAccessById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.sharedAccessService.getAccessById(id);
      return new ResponseSuccess('GET_ACCESS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createAccess(@Body() access: CreateAccessDto): Promise<IResponse> {
    try {
      const data = await this.sharedAccessService.createAccess(access);
      return new ResponseSuccess('CREATE_ACCESS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateAccess(
    @Param() { id }: FindOneParams,
    @Body() access: UpdateAccessDto,
  ): Promise<IResponse> {
    try {
      const data = await this.sharedAccessService.updateAccess(id, access);
      return new ResponseSuccess('UPDATE_ACCESS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteAccess(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.sharedAccessService.deleteAccess(id);
      return new ResponseSuccess('DELETE_ACCESS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
