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
} from '@nestjs/common';
import { FieldService } from './field.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { GetFieldDto } from './dto/get-field.dto';
import FindOneParams from '@utils/find-one-params';
import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('shared/field')
@UseInterceptors(ClassSerializerInterceptor)
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllFields(@Query() query: GetFieldDto): Promise<IResponse> {
    try {
      const data = await this.fieldService.getAllFields(query);
      return new ResponseSuccess('GET_MODULES.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getFieldById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.fieldService.getFieldById(id);
      return new ResponseSuccess('GET_MODULES.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createField(@Body() field: CreateFieldDto): Promise<IResponse> {
    try {
      const data = await this.fieldService.createField(field);
      return new ResponseSuccess('CREATE_MODULES.SUCCESS', data);
    } catch (error) {
      console.log('aldaa======>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateField(
    @Param() { id }: FindOneParams,
    @Body() field: UpdateFieldDto,
  ): Promise<IResponse> {
    try {
      const data = await this.fieldService.updateField(id, field);
      return new ResponseSuccess('UPDATE_MODULES.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteField(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.fieldService.deleteField(id);
      return new ResponseSuccess('DELETE_MODULES.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
